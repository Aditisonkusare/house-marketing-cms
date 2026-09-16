function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderCampaignEmailHtml({
  subject,
  body,
  newsPostLink,
  unsubscribeUrl,
}: {
  subject: string;
  body: string;
  newsPostLink?: string;
  unsubscribeUrl: string;
}) {
  const bodyHtml = escapeHtml(body).replace(/\n/g, "<br>");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <h1 style="margin:0;font-size:20px;color:#111827;">${escapeHtml(subject)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px;font-size:15px;line-height:1.6;color:#374151;">
                ${bodyHtml}
              </td>
            </tr>
            ${
              newsPostLink
                ? `<tr>
              <td style="padding:0 32px 24px 32px;">
                <a href="${escapeHtml(newsPostLink)}" style="display:inline-block;padding:10px 18px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;">Read more</a>
              </td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:24px 32px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af;">
                You're receiving this because you registered for updates on Glenveagh Homes.
                <a href="${escapeHtml(unsubscribeUrl)}" style="color:#9ca3af;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
