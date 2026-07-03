const SITE_URL = "https://www.aaroncurtisyoga.com";
const BRAND_BLUE = "#0842a0";

interface RenderNewsletterHtmlParams {
  contentHtml: string;
  previewText?: string;
  /**
   * Resend replaces this placeholder per-recipient when sending a broadcast.
   * For test sends (transactional API), pass a real URL instead since no
   * substitution happens there.
   */
  unsubscribeUrl?: string;
}

/**
 * Wraps TipTap-generated HTML in an email-safe, table-based layout with
 * site branding and the CAN-SPAM-required unsubscribe link.
 */
export function renderNewsletterHtml({
  contentHtml,
  previewText,
  unsubscribeUrl = "{{{RESEND_UNSUBSCRIBE_URL}}}",
}: RenderNewsletterHtmlParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<style>
  body { margin: 0; padding: 0; background-color: #f4f4f5; }
  .content h1, .content h2, .content h3 {
    font-family: Georgia, 'Times New Roman', serif;
    color: #18181b;
    line-height: 1.3;
    margin: 24px 0 12px;
  }
  .content h1 { font-size: 26px; }
  .content h2 { font-size: 22px; }
  .content h3 { font-size: 18px; }
  .content p { margin: 0 0 16px; }
  .content ul, .content ol { margin: 0 0 16px; padding-left: 24px; }
  .content li { margin-bottom: 6px; }
  .content blockquote {
    border-left: 3px solid ${BRAND_BLUE};
    margin: 16px 0;
    padding: 4px 0 4px 16px;
    color: #52525b;
    font-style: italic;
  }
  .content a { color: ${BRAND_BLUE}; }
  .content img { max-width: 100%; height: auto; }
</style>
</head>
<body>
${
  previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : ""
}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="padding: 16px 8px; text-align: center;">
            <a href="${SITE_URL}" style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: ${BRAND_BLUE}; text-decoration: none; letter-spacing: 0.5px;">
              Aaron Curtis Yoga
            </a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff; border-radius: 8px; padding: 32px 28px;">
            <div class="content" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #3f3f46;">
              ${contentHtml}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 24px 8px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.6; color: #71717a;">
            You're receiving this email because you signed up at
            <a href="${SITE_URL}" style="color:#71717a;">aaroncurtisyoga.com</a>.
            <br>
            <a href="${unsubscribeUrl}" style="color:#71717a;">Unsubscribe</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
