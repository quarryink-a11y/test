import Stripe from 'npm:stripe@17.0.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.text();
    
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    let event;
    
    if (webhookSecret && webhookSecret !== 'placeholder') {
      const signature = req.headers.get('stripe-signature');
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      let items = [];
      try {
        items = JSON.parse(session.metadata?.items_json || '[]');
      } catch (e) {
        items = [];
      }

      const totalAmount = session.amount_total / 100;
      const currency = (session.currency || 'usd').toUpperCase();
      const ownerEmail = session.metadata?.owner_email || '';

      await base44.asServiceRole.entities.Order.create({
        customer_email: session.customer_details?.email || '',
        customer_name: session.customer_details?.name || '',
        items: items,
        total_amount: totalAmount,
        currency: currency,
        status: 'paid',
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        owner_email: ownerEmail,
      });

      // Send confirmation email to customer
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name || 'Customer';
      if (customerEmail) {
        const itemsList = items.map(i => `• ${i.name} x${i.quantity || 1} — ${currency} ${i.price}`).join('<br>');
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: customerEmail,
          subject: `Order Confirmation — ${currency} ${totalAmount}`,
          body: `
            <h2>Thank you for your purchase, ${customerName}!</h2>
            <p>Your order has been confirmed.</p>
            <h3>Order details:</h3>
            <p>${itemsList}</p>
            <p><strong>Total: ${currency} ${totalAmount}</strong></p>
            <br>
            <p>If you have any questions, please contact the artist directly.</p>
          `,
        });
      }

      // Notify shop owner
      if (ownerEmail) {
        const itemsList = items.map(i => `• ${i.name} x${i.quantity || 1} — ${currency} ${i.price}`).join('<br>');
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: ownerEmail,
          subject: `New Order — ${currency} ${totalAmount} from ${customerName}`,
          body: `
            <h2>You have a new order!</h2>
            <p><strong>Customer:</strong> ${customerName} (${customerEmail || 'no email'})</p>
            <h3>Items:</h3>
            <p>${itemsList}</p>
            <p><strong>Total: ${currency} ${totalAmount}</strong></p>
          `,
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return Response.json({ error: error.message }, { status: 400 });
  }
});