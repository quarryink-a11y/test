import Stripe from 'npm:stripe@17.0.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { items, success_url, cancel_url, owner_email } = await req.json();

    if (!items || !items.length) {
      return Response.json({ error: 'No items provided' }, { status: 400 });
    }

    // Find the shop owner's Stripe Connect account
    let stripeAccountId = null;
    if (owner_email) {
      const owners = await base44.asServiceRole.entities.User.filter({ email: owner_email });
      if (owners.length && owners[0].stripe_account_id) {
        stripeAccountId = owners[0].stripe_account_id;
      }
    }

    if (!stripeAccountId) {
      return Response.json({ error: 'Shop owner has not connected Stripe' }, { status: 400 });
    }

    // Validate prices from database — never trust client-sent prices
    const catalogItemIds = items.map(i => i.id).filter(Boolean);
    if (!catalogItemIds.length) {
      return Response.json({ error: 'Items must have catalog IDs' }, { status: 400 });
    }

    const catalogItems = await base44.asServiceRole.entities.CatalogItem.filter({});
    const catalogMap = {};
    for (const ci of catalogItems) {
      catalogMap[ci.id] = ci;
    }

    const verifiedItems = [];
    for (const item of items) {
      const dbItem = catalogMap[item.id];
      if (!dbItem) {
        return Response.json({ error: `Item not found: ${item.id}` }, { status: 400 });
      }
      if (!dbItem.is_active) {
        return Response.json({ error: `Item is no longer available: ${dbItem.name}` }, { status: 400 });
      }
      verifiedItems.push({
        id: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        currency: dbItem.currency || 'USD',
        image_url: dbItem.image_url,
        quantity: Math.max(1, Math.round(item.quantity || 1)),
      });
    }

    const line_items = verifiedItems.map(item => ({
      price_data: {
        currency: item.currency.toLowerCase(),
        product_data: {
          name: item.name,
          ...(item.image_url ? { images: [item.image_url] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: success_url || 'https://quarry.ink?payment=success',
      cancel_url: cancel_url || 'https://quarry.ink?payment=cancelled',
      metadata: {
        owner_email,
        items_json: JSON.stringify(verifiedItems.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          currency: i.currency,
          quantity: i.quantity,
        }))),
      },
    }, {
      stripeAccount: stripeAccountId,
    });

    return Response.json({ url: session.url, session_id: session.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});