import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { templateId } = await req.json();

    if (!templateId) {
      return Response.json({ error: 'No template ID provided' }, { status: 400 });
    }

    const template = await base44.asServiceRole.entities.Template.get(templateId);

    if (!template) {
      return Response.json({ error: 'Template not found' }, { status: 404 });
    }

    return Response.json(template);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});