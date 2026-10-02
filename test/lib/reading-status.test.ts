import { readingStatus, worstStatus } from '@/lib/reading-status';

const RANGE = { min: 28, max: 32 };

describe('readingStatus', () => {
  it('範囲の中央は normal', () => {
    expect(readingStatus(30, RANGE)).toBe('normal');
  });
  it('範囲の端は warning', () => {
    expect(readingStatus(28.1, RANGE)).toBe('warning');
    expect(readingStatus(31.9, RANGE)).toBe('warning');
  });
  it('範囲外は danger', () => {
    expect(readingStatus(27, RANGE)).toBe('danger');
    expect(readingStatus(35, RANGE)).toBe('danger');
  });
});

describe('worstStatus', () => {
  it('最も重いステータスを返す', () => {
    expect(worstStatus('normal', 'warning', 'danger')).toBe('danger');
    expect(worstStatus('normal', 'warning')).toBe('warning');
    expect(worstStatus('normal', 'normal')).toBe('normal');
  });
});
