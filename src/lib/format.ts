// 計測値の表示フォーマット。

/** 温度を「21.5°C」のように表示する。null/undefined/NaN は "--°C"。 */
export function formatTemp(celsius: number | null | undefined, fractionDigits = 1): string {
  if (celsius == null || Number.isNaN(celsius)) return '--°C';
  return `${celsius.toFixed(fractionDigits)}°C`;
}

/** 湿度を「55%」のように表示する。null/undefined/NaN は "--%"。 */
export function formatHumidity(percent: number | null | undefined): string {
  if (percent == null || Number.isNaN(percent)) return '--%';
  return `${Math.round(percent)}%`;
}
