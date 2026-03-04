import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { slug } = await req.json();

    if (!slug) {
      return Response.json({ error: 'No slug provided' }, { status: 400 });
    }

    const users = await base44.asServiceRole.entities.User.filter({ site_slug: slug });

    if (!users.length || !users[0].site_published) {
      return Response.json({ error: 'Site not found' }, { status: 404 });
    }

    const owner = users[0];
    const ownerEmail = owner.email;
    const sections = owner.site_sections || {};

    // Load all site data using service role
    const [portfolio, designs, events, reviews, bookingSteps, faqCategories, faqItems, contactList, catalogItems] = await Promise.all([
      sections.portfolio !== false
        ? base44.asServiceRole.entities.PortfolioItem.filter({ created_by: ownerEmail }, 'sort_order')
        : Promise.resolve([]),
      sections.designs
        ? base44.asServiceRole.entities.DesignItem.filter({ created_by: ownerEmail }, 'sort_order')
        : Promise.resolve([]),
      sections.events
        ? base44.asServiceRole.entities.Event.filter({ created_by: ownerEmail }, '-created_date')
        : Promise.resolve([]),
      sections.reviews
        ? base44.asServiceRole.entities.Review.filter({ created_by: ownerEmail }, '-created_date')
        : Promise.resolve([]),
      sections.how_to_book !== false
        ? base44.asServiceRole.entities.BookingStep.filter({ created_by: ownerEmail }, 'step_number')
        : Promise.resolve([]),
      sections.faq !== false
        ? base44.asServiceRole.entities.FaqCategory.filter({ created_by: ownerEmail }, 'sort_order')
        : Promise.resolve([]),
      sections.faq !== false
        ? base44.asServiceRole.entities.FaqItem.filter({ created_by: ownerEmail }, 'sort_order')
        : Promise.resolve([]),
      base44.asServiceRole.entities.ContactInfo.filter({ created_by: ownerEmail }, '-created_date'),
      sections.catalog
        ? base44.asServiceRole.entities.CatalogItem.filter({ created_by: ownerEmail }, '-created_date')
        : Promise.resolve([]),
    ]);

    const contact = contactList[0] || null;

    const body = {
      siteSlug: slug,
      owner: {
        full_name: owner.full_name,
        email: ownerEmail,
        headline: contact?.artist_full_name || owner.headline || owner.full_name,
        short_intro_text: contact?.short_description || owner.short_intro_text,
        hero_media_type: owner.hero_media_type,
        hero_media_url: owner.hero_media_url,
        about_me_text: owner.about_me_text,
        about_blocks: owner.about_blocks,
        artist_photo_url: owner.artist_photo_url,
        site_sections: sections,
        stripe_connected: !!owner.stripe_account_id,
      },
      portfolio,
      designs,
      events,
      reviews,
      bookingSteps,
      faqCategories,
      faqItems,
      contact,
      catalogItems: catalogItems.filter(i => i.is_active !== false),
    };

    return new Response(JSON.stringify(body), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, s-maxage=120',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});