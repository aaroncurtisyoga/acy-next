// Helpers for interpreting pasted plain-text HTML *source* — e.g. markup an AI
// hands back and you copy from a code block — as formatted content instead of
// literal angle-bracket text. Used by the Tiptap editor's handlePaste.

/** Strip a surrounding ```html … ``` (or bare ``` … ```) code fence, if present. */
export const stripCodeFence = (text: string): string => {
  const match = text.trim().match(/^```(?:html)?\s*\n?([\s\S]*?)\n?```$/i);
  return match ? match[1] : text;
};

// Tags an AI-formatted block plausibly leads with. The allowlist keeps
// tag-shaped-but-not-HTML pastes — <TODO>, <name@example.com>, <https://link> —
// from being reinterpreted as markup and silently dropped.
const HTML_TAGS = new Set([
  "a",
  "abbr",
  "b",
  "blockquote",
  "br",
  "code",
  "del",
  "div",
  "em",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "img",
  "ins",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "section",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

/**
 * True when the text looks like HTML source we should parse. Requires the
 * content to *begin* with a recognized HTML tag, so prose that merely mentions a
 * "<tag>" — or an <email@example.com> / <https://link> — is left as literal text.
 */
export const looksLikeHtmlSource = (text: string): boolean => {
  const match = text.trim().match(/^<\/?([a-z][a-z0-9-]*)/i);
  return !!match && HTML_TAGS.has(match[1].toLowerCase());
};
