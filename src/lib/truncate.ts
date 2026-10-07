const ELLIPSIS = '...';

/**
 * Shorten `value` to at most `max` UTF-16 code units, ending in "..." when it
 * is cut. Cuts on whole code points, so a surrogate pair (such as an emoji) is
 * never split in half. An emoji built from several code points (a family, a
 * flag or a skin tone) can still be cut to part of itself at the boundary.
 *
 * When `max` is not larger than the ellipsis there is no room for it, so the
 * value is hard-cut with `slice(0, max)`.
 */
export function truncate(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  if (max <= ELLIPSIS.length) {
    return value.slice(0, max);
  }
  const budget = max - ELLIPSIS.length;
  let end = 0;
  for (const char of value) {
    if (end + char.length > budget) {
      break;
    }
    end += char.length;
  }
  return `${value.slice(0, end)}${ELLIPSIS}`;
}
