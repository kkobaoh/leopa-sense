import type { PetSex } from './api';

/** 性別の表示ラベル。 */
export const SEX_LABEL: Record<PetSex, string> = {
  male: 'オス',
  female: 'メス',
  unknown: '不明',
};

export function sexLabel(sex: PetSex): string {
  return SEX_LABEL[sex];
}
