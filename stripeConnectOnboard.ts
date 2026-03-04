import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();

    // Support both: direct call with userEmail, and entity automation payload
    let userEmail = body.userEmail;

    // If called from entity automation (User delete event)
    if (body.event?.type === 'delete' && body.old_data?.email) {
      userEmail = body.old_data.email;
    }

    // If not an automation call, verify the user is authenticated and is admin
    if (!body.event) {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }
    }

    if (!userEmail) {
      return Response.json({ error: 'Could not determine user email' }, { status: 400 });
    }

    // Delete all content created by this user across all entities
    const entityNames = [
      'PortfolioItem',
      'DesignItem',
      'Event',
      'Review',
      'ContactInfo',
      'BookingStep',
      'FaqCategory',
      'FaqItem',
      'CatalogItem',
      'AdminProfile',
      'SiteSettings',
      'Inquiry',
    ];

    const results = {};

    for (const entityName of entityNames) {
      try {
        const items = await base44.asServiceRole.entities[entityName].filter({ created_by: userEmail });
        for (const item of items) {
          await base44.asServiceRole.entities[entityName].delete(item.id);
        }
        results[entityName] = items.length;
      } catch (e) {
        results[entityName] = `error: ${e.message}`;
      }
    }

    return Response.json({ 
      success: true, 
      message: `All data for ${userEmail} has been deleted`,
      deleted: results 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});