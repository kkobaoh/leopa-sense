import { formatHumidity, formatTemp } from '@/lib/format';

describe('formatTemp', () => {
  it('小数1桁で単位付きフォーマットする', () => {
    expect(formatTemp(21.456)).toBe('21.5°C');
  });
  it('桁数を指定できる', () => {
    expect(formatTemp(30, 0)).toBe('30°C');
  });
  it('null/undefined/NaN はプレースホルダ', () => {
    expect(formatTemp(null)).toBe('--°C');
    expect(formatTemp(undefined)).toBe('--°C');
    expect(formatTemp(NaN)).toBe('--°C');
  });
});

describe('formatHumidity', () => {
  it('四捨五入して % 付きで返す', () => {
    expect(formatHumidity(54.6)).toBe('55%');
  });
  it('null はプレースホルダ', () => {
    expect(formatHumidity(null)).toBe('--%');
  });
});
