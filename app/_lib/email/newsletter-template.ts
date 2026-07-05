const SITE_URL = "https://www.aaroncurtisyoga.com";
const COBALT = "#2749e0";
const NAVY = "#131826";
const INK = "#222222";

/**
 * Resend substitutes {{{contact.*}}} merge tags per-recipient only when a
 * broadcast actually sends. Previews, the sent-newsletter viewer, and test
 * sends go through APIs that DON'T substitute, so resolve the tags ourselves in
 * those contexts — using the supplied values, or each tag's own |fallback (or
 * empty when it has none) — so nobody sees a raw "{{{contact.first_name}}}".
 * Leaves {{{RESEND_UNSUBSCRIBE_URL}}} untouched (handled via unsubscribeUrl).
 */
export function resolveMergeTags(
  html: string,
  values: { firstName?: string; lastName?: string; email?: string } = {},
): string {
  const map: Record<string, string | undefined> = {
    first_name: values.firstName,
    last_name: values.lastName,
    email: values.email,
  };
  return html.replace(
    /\{\{\{\s*contact\.(first_name|last_name|email)\s*(?:\|([^}]*))?\}\}\}/g,
    (_match, field: string, fallback = "") => {
      const value = map[field];
      return (value && value.trim()) || fallback.trim();
    },
  );
}

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
 * Wraps TipTap-generated HTML in an email-safe, table-based layout with the
 * "Practice Notes" branding (cobalt/navy, Helvetica poster style) and the
 * CAN-SPAM-required unsubscribe link.
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
  body { margin: 0; padding: 0; background-color: #ededeb; }
  .content h1, .content h2, .content h3 {
    font-family: Helvetica, Arial, sans-serif;
    color: ${INK};
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    line-height: 1.25;
    margin: 26px 0 12px;
  }
  .content h1 { font-size: 24px; }
  .content h2 { font-size: 20px; }
  .content h3 { font-size: 16px; letter-spacing: 0.12em; }
  .content p { margin: 0 0 16px; }
  .content ul, .content ol { margin: 0 0 16px; padding-left: 24px; }
  .content li { margin-bottom: 6px; }
  .content blockquote {
    border-left: 4px solid ${COBALT};
    margin: 18px 0;
    padding: 4px 0 4px 16px;
    color: #52525b;
  }
  .content a { color: ${COBALT}; font-weight: 600; }
  .content img { max-width: 100%; height: auto; }
  .content hr { border: none; border-top: 2px solid ${INK}; margin: 26px 0; }
</style>
</head>
<body>
${
  previewText
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : ""
}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ededeb;">
  <tr>
    <td align="center" style="padding: 24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background-color:#ffffff; border-top: 5px solid ${NAVY}; padding: 34px 36px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:${NAVY}; width:44px; height:44px; text-align:center; vertical-align:middle;">
                  <span style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 800; color: #ffffff; letter-spacing: 0.02em;">AC</span>
                </td>
                <td style="padding-left: 14px;">
                  <a href="${SITE_URL}" style="font-family: Helvetica, Arial, sans-serif; font-size: 23px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.03em; color: ${INK}; text-decoration: none;">
                    Practice Notes
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color:#ffffff; padding: 22px 36px 36px;">
            <div class="content" style="font-family: Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #3f3f46;">
              ${contentHtml}
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding: 26px 8px 0; text-align: center; font-family: Helvetica, Arial, sans-serif; font-size: 12px; line-height: 2; color: #71717a;">
            <a href="${SITE_URL}" style="color:${INK}; font-weight:700; text-decoration:none; text-transform: lowercase;">home</a>
            &nbsp;&middot;&nbsp;
            <a href="${SITE_URL}/#this-week" style="color:${INK}; font-weight:700; text-decoration:none; text-transform: lowercase;">classes</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.instagram.com/aaroncurtisyoga/" style="color:${INK}; font-weight:700; text-decoration:none; text-transform: lowercase;">instagram</a>
            &nbsp;&middot;&nbsp;
            <a href="https://www.youtube.com/channel/UCwwNWri2IhKxXKmQkCpj-uw" style="color:${INK}; font-weight:700; text-decoration:none; text-transform: lowercase;">youtube</a>
            <br>
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
