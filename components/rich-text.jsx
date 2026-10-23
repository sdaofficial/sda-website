import Link from 'next/link';

const LINK_PATTERN =
  /<a\s+[^>]*href\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>([\s\S]*?)<\/a>|\[([^\]\n]+)\]\(([^)\s]+)\)/gi;

function safeHref(href) {
  const value = href?.trim();
  if (!value) return null;
  if (value.startsWith('/') || value.startsWith('#') || value.startsWith('mailto:')) return value;
  try {
    const url = new URL(value);
    if (url.protocol === 'http:' || url.protocol === 'https:') return value;
  } catch {
    return null;
  }
  return null;
}

function linkProps(href) {
  const external = href.startsWith('http') || href.startsWith('mailto:');
  if (!external) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
}

function renderEmphasis(text, keyPrefix) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((piece, index) => {
      const bold = piece.match(/^\*\*([^*]+)\*\*$/);
      if (!bold) return piece;
      return (
        <strong key={`${keyPrefix}-em-${index}`} className="font-bold text-primary">
          {bold[1]}
        </strong>
      );
    });
}

function renderInline(text, keyPrefix) {
  const nodes = [];
  let lastIndex = 0;
  let matchIndex = 0;
  const pattern = new RegExp(LINK_PATTERN.source, 'gi');

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) nodes.push(...renderEmphasis(text.slice(lastIndex, index), `${keyPrefix}-t-${matchIndex}`));

    const href = safeHref(match[1] || match[2] || match[5]);
    const label = (match[3] || match[4] || '').replace(/<[^>]*>/g, '');
    if (href && label) {
      nodes.push(
        <Link
          key={`${keyPrefix}-${matchIndex}`}
          href={href}
          className="font-semibold text-primary no-underline hover:underline"
          {...linkProps(href)}
        >
          {label}
        </Link>
      );
    } else {
      nodes.push(match[0]);
    }

    lastIndex = index + match[0].length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) nodes.push(...renderEmphasis(text.slice(lastIndex), `${keyPrefix}-end`));
  return nodes;
}

function paragraphBlocks(text) {
  return text.split(/\n\n+/).map((paragraph) => {
    const prose = [];
    const items = [];
    for (const line of paragraph.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith('- ')) items.push(trimmed.slice(2));
      else prose.push(line);
    }
    return { prose, items };
  });
}

export function RichText({ text, className, listClassName }) {
  if (!text?.trim()) return null;

  return paragraphBlocks(text).map((block, index) => (
    <div key={index} className="flex flex-col gap-3">
      {block.prose.length > 0 ? (
        <p className={className}>
          {block.prose.map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 ? <br /> : null}
              {renderInline(line, `${index}-p-${lineIndex}`)}
            </span>
          ))}
        </p>
      ) : null}
      {block.items.length > 0 ? (
        <ul className={listClassName || 'list-disc space-y-1 pl-5'}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className={className}>
              {renderInline(item, `${index}-li-${itemIndex}`)}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  ));
}
