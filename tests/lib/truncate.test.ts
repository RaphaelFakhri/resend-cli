import { describe, expect, it } from 'vitest';
import { renderReceivingEmailsTable } from '../../src/commands/emails/receiving/utils';
import { truncate } from '../../src/lib/truncate';

const LONE_SURROGATE =
  /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/;

describe('truncate', () => {
  it('returns the value unchanged when it fits', () => {
    expect(truncate('hello', 5)).toBe('hello');
    expect(truncate('', 5)).toBe('');
  });

  it('cuts to max characters including the ellipsis', () => {
    const out = truncate('abcdefghij', 8);
    expect(out).toBe('abcde...');
    expect(out).toHaveLength(8);
  });

  it('does not split a surrogate pair at the cut point', () => {
    // 46 characters, then an emoji whose high surrogate lands at index 46.
    const value = `${'a'.repeat(46)}😀${'b'.repeat(10)}`;
    const out = truncate(value, 50);
    expect(out).toBe(`${'a'.repeat(46)}...`);
    expect(out).not.toMatch(LONE_SURROGATE);
  });

  it('keeps a whole emoji that ends exactly at the cut point', () => {
    const value = `${'a'.repeat(45)}😀${'b'.repeat(10)}`;
    expect(truncate(value, 50)).toBe(`${'a'.repeat(45)}😀...`);
  });
});

describe('renderReceivingEmailsTable', () => {
  it('does not leave a lone surrogate when truncating an emoji subject', () => {
    const subject = `${'a'.repeat(46)}😀${'b'.repeat(10)}`;
    const table = renderReceivingEmailsTable([
      {
        id: 'rcv_1',
        to: ['inbox@example.com'],
        from: 'sender@example.com',
        subject,
        created_at: '2026-02-18 12:00:00+00',
        message_id: '<m@example.com>',
        bcc: null,
        cc: null,
        reply_to: null,
        attachments: [],
      },
    ]);
    expect(table).not.toMatch(LONE_SURROGATE);
    expect(table).toContain(`${'a'.repeat(46)}...`);
  });
});
