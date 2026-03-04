import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow both: scheduled automation (no user context) and admin manual call
    let isAutomation = false;
    try {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
      }
    } catch {
      // No auth context — called from scheduled automation, proceed with service role
      isAutomation = true;
    }

    // Get all events that are not already closed and have an end_date
    const allEvents = await base44.asServiceRole.entities.Event.filter({});
    const today = new Date().toISOString().split('T')[0];
    let closedCount = 0;

    for (const event of allEvents) {
      if (event.status !== 'Closed' && event.end_date && event.end_date < today) {
        await base44.asServiceRole.entities.Event.update(event.id, { status: 'Closed' });
        closedCount++;
      }
    }

    return Response.json({ success: true, closedCount, source: isAutomation ? 'automation' : 'admin' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});