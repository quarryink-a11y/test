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

    const { return_url } = await req.json();

    let accountId = user.stripe_account_id;

    // Create a new Connect account if none exists
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        metadata: { user_email: user.email },
      });
      accountId = account.id;

      // Save account ID on user
      await base44.auth.updateMe({ stripe_account_id: accountId });
    }

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: return_url || 'https://quarry.ink',
      return_url: return_url || 'https://quarry.ink',
      type: 'account_onboarding',
    });

    return Response.json({ url: accountLink.url, account_id: accountId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});