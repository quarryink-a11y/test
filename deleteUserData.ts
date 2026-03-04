import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { inquiry, ownerEmail, ownerName, siteSlug } = await req.json();

    if (!ownerEmail || !inquiry) {
      return Response.json({ error: 'Missing data' }, { status: 400 });
    }

    // Validate required inquiry fields to prevent spam/abuse
    if (!inquiry.first_name || typeof inquiry.first_name !== 'string' || inquiry.first_name.trim().length < 1) {
      return Response.json({ error: 'First name is required' }, { status: 400 });
    }
    if (!inquiry.client_email || typeof inquiry.client_email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.client_email)) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Sanitize text fields — strip HTML tags to prevent injection
    const sanitize = (val) => typeof val === 'string' ? val.replace(/<[^>]*>/g, '').slice(0, 2000) : '';
    inquiry.first_name = sanitize(inquiry.first_name).slice(0, 100);
    inquiry.last_name = sanitize(inquiry.last_name || '').slice(0, 100);
    inquiry.idea_description = sanitize(inquiry.idea_description || '');
    inquiry.client_phone = sanitize(inquiry.client_phone || '').slice(0, 30);
    inquiry.city = sanitize(inquiry.city || '').slice(0, 100);

    // Verify the ownerEmail belongs to a real user in the app (security check)
    const users = await base44.asServiceRole.entities.User.filter({ email: ownerEmail });
    if (!users.length) {
      return Response.json({ error: 'Owner not found' }, { status: 404 });
    }

    // Rate limiting: max 5 inquiries per email per hour to the same owner
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const recentInquiries = await base44.asServiceRole.entities.Inquiry.filter({
      client_email: inquiry.client_email,
    });
    const recentCount = recentInquiries.filter(inq => inq.created_date >= oneHourAgo).length;
    if (recentCount >= 5) {
      return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const siteUrl = siteSlug ? `https://quarry.ink/${siteSlug}` : '';

    // Build inspiration links HTML
    let inspirationHtml = '';
    if (inquiry.inspiration_urls && inquiry.inspiration_urls.length > 0) {
      inspirationHtml = inquiry.inspiration_urls.map((url, i) => 
        `<a href="${url}" target="_blank" style="color: #4F7CFF; text-decoration: underline;">Photo ${i + 1}</a>`
      ).join(' &nbsp; ');
    }

    const rows = [];
    
    if (inquiry.first_name || inquiry.last_name) {
      rows.push({ label: 'Name', value: `${inquiry.first_name || ''} ${inquiry.last_name || ''}`.trim() });
    }
    if (inquiry.client_email) {
      rows.push({ label: 'Email', value: `<a href="mailto:${inquiry.client_email}" style="color: #4F7CFF; text-decoration: none;">${inquiry.client_email}</a>` });
    }
    if (inquiry.client_phone) {
      rows.push({ label: 'Phone', value: inquiry.client_phone });
    }
    if (inquiry.idea_description) {
      rows.push({ label: 'Tattoo idea', value: inquiry.idea_description });
    }
    if (inquiry.placement) {
      rows.push({ label: 'Placement', value: inquiry.placement });
    }
    if (inquiry.size_value) {
      rows.push({ label: 'Approximate size', value: `${inquiry.size_value} ${inquiry.size_unit || ''}`.trim() });
    }
    if (inquiry.preferred_date) {
      rows.push({ label: 'Preferred date', value: inquiry.preferred_date });
    }
    if (inquiry.city) {
      rows.push({ label: 'City', value: inquiry.city });
    }
    if (inquiry.referral_source) {
      rows.push({ label: 'How found you', value: inquiry.referral_source });
    }
    if (inspirationHtml) {
      rows.push({ label: 'Inspiration', value: inspirationHtml });
    }

    const tableRows = rows.map(r => `
      <tr>
        <td style="padding: 12px 16px; font-weight: 600; color: #374151; white-space: nowrap; vertical-align: top; border-bottom: 1px solid #F3F4F6; width: 160px; font-size: 14px;">
          ${r.label}
        </td>
        <td style="padding: 12px 16px; color: #4B5563; border-bottom: 1px solid #F3F4F6; font-size: 14px; line-height: 1.5;">
          ${r.value}
        </td>
      </tr>
    `).join('');

    const emailBody = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1F2937 0%, #111827 100%); border-radius: 12px 12px 0 0; padding: 32px 32px 28px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.5); margin-bottom: 8px;">New booking request</div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #FFFFFF;">
            ✨ You have a new inquiry!
          </h1>
          ${siteUrl ? `<p style="margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.6);">From your site: <a href="${siteUrl}" style="color: #93C5FD; text-decoration: none;">${siteUrl}</a></p>` : ''}
        </div>

        <!-- Body -->
        <div style="background: #FFFFFF; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 12px 12px; padding: 0;">
          
          <!-- Client quick info -->
          <div style="padding: 24px 32px; border-bottom: 1px solid #F3F4F6; display: flex; align-items: center;">
            <div style="background: #EEF2FF; border-radius: 50%; width: 48px; height: 48px; display: inline-block; text-align: center; line-height: 48px; font-size: 20px; font-weight: 700; color: #4F46E5; margin-right: 16px; vertical-align: middle;">
              ${(inquiry.first_name || '?')[0].toUpperCase()}
            </div>
            <div style="display: inline-block; vertical-align: middle;">
              <div style="font-size: 18px; font-weight: 700; color: #111827;">${inquiry.first_name || ''} ${inquiry.last_name || ''}</div>
              <div style="font-size: 13px; color: #6B7280; margin-top: 2px;">${inquiry.client_email || ''}</div>
            </div>
          </div>

          <!-- Details table -->
          <div style="padding: 8px 16px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${tableRows}
            </table>
          </div>

          <!-- CTA -->
          <div style="padding: 24px 32px; text-align: center;">
            <a href="mailto:${inquiry.client_email || ''}" style="display: inline-block; background: #111827; color: #FFFFFF; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none;">
              Reply to ${inquiry.first_name || 'client'}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 24px 0 0; font-size: 12px; color: #9CA3AF;">
          Sent by <a href="https://quarry.ink" style="color: #6B7280; text-decoration: none; font-weight: 500;">Quarry.ink</a> — your tattoo website platform
        </div>
      </div>
    </body>
    </html>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ownerEmail,
      subject: `New booking request from ${inquiry.first_name || 'a client'} ${inquiry.last_name || ''}`.trim(),
      body: emailBody,
      from_name: 'Quarry.ink',
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});