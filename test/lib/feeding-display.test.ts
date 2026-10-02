import { daysSince, feedingBadge } from '@/lib/feeding-display';

const NOW = new Date('2026-01-10T00:00:00.000Z');

describe('daysSince', () => {
  it('経過日数を切り捨てで返す', () => {
    expect(daysSince('2026-01-07T00:00:00.000Z', NOW)).toBe(3);
  });
  it('未来なら 0', () => {
    expect(daysSince('2026-01-20T00:00:00.000Z', NOW)).toBe(0);
  });
});

describe('feedingBadge', () => {
  it('記録なしは「給餌記録なし」', () => {
    expect(feedingBadge(null, 5, NOW)).toEqual({ text: '給餌記録なし', overdue: false });
  });

  it('当日は「今日」', () => {
    expect(feedingBadge('2026-01-10T00:00:00.000Z', 5, NOW)).toEqual({
      text: '前回給餌 今日',
      overdue: false,
    });
  });

  it('間隔内は overdue でない', () => {
    expect(feedingBadge('2026-01-07T00:00:00.000Z', 5, NOW)).toEqual({
      text: '前回給餌 3日前',
      overdue: false,
    });
  });

  it('間隔以上経過で overdue', () => {
    expect(feedingBadge('2026-01-04T00:00:00.000Z', 5, NOW)).toEqual({
      text: '前回給餌 6日前',
      overdue: true,
    });
  });

  it('間隔が未設定なら overdue にならない', () => {
    expect(feedingBadge('2026-01-01T00:00:00.000Z', null, NOW).overdue).toBe(false);
  });
});
