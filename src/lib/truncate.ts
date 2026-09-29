const ELLIPSIS = '...';

/**
 * Shorten `value` to at most `max` UTF-16 code units, ending in "..." when it
 * is cut. Never splits a surrogate pair, so emoji at the cut point are
 * dropped whole instead of leaving a lone surrogate that terminals print as
 * a replacement character.
 */
export function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  let end = Math.max(0, max - ELLIPSIS.length);
  const last = value.charCodeAt(end - 1);
  if (end > 0 && last >= 0xd800 && last <= 0xdbff) {
    end -= 1;
  }
  return `${value.slice(0, end)}${ELLIPSIS}`;
}
