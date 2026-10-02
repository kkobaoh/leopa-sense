import type { GeckoSex } from './api';

/** 性別の表示ラベル。 */
export const SEX_LABEL: Record<GeckoSex, string> = {
  male: 'オス',
  female: 'メス',
  unknown: '不明',
};

export function sexLabel(sex: GeckoSex): string {
  return SEX_LABEL[sex];
}
