import Stripe from 'npm:stripe@17.0.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const stripe = new Stripe(Deno.env.get("STRIPE_API_KEY"));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const accountId = user.stripe_account_id;
    if (!accountId) {
      return Response.json({ connected: false, charges_enabled: false });
    }

    const account = await stripe.accounts.retrieve(accountId);

    return Response.json({
      connected: true,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      account_id: accountId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});