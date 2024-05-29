import { sanitize } from 'dompurify';
import MarkdownIt from 'markdown-it';

const markdownIt = new MarkdownIt({
  linkify: true,
  html: false,
});

const defaultLinkOpen =
  markdownIt.renderer.rules.link_open ||
  function defaultLinkOpen(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

// Open all links in a new tab and instruct search engines not to follow them
markdownIt.renderer.rules.link_open = function linkOpen(tokens, idx, options, env, self) {
  tokens[idx].attrPush(['target', '_blank']);
  tokens[idx].attrPush(['rel', 'nofollow noopener noreferrer']);
  return defaultLinkOpen(tokens, idx, options, env, self);
};


export function renderToHTML(markdownSourceText: string) {
  return sanitize(markdownIt.render(markdownSourceText), {
    ADD_ATTR: ['target'],
  });
}


export function renderToPlainText(markdownSourceText: string) {
  return sanitize(renderToHTML(markdownSourceText), {
    USE_PROFILES: { html: false },
  });
}

export function truncateDescription(description: string, maxLength: number) {
  if (description.length > maxLength) {
    return `${description.slice(0, maxLength)}...`;
  }
  return description;
}

export default { renderToHTML, renderToPlainText };
