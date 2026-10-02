import { z } from 'zod';

// 個体（レオパ）のドメインモデルとバリデーション。
// DB は snake_case だが、アプリ内は camelCase に統一し、
// Supabase 実装の境界（lib/api 内）だけでマッピングする方針。

export const geckoSexSchema = z.enum(['male', 'female', 'unknown']);
export type GeckoSex = z.infer<typeof geckoSexSchema>;

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 形式で入力してください');

/** 個体作成時の入力。name 以外は任意。 */
export const geckoCreateInputSchema = z.object({
  name: z.string().trim().min(1, '名前は必須です'),
  enclosureId: z.string().min(1).nullable().optional(),
  morph: z.string().trim().min(1).nullable().optional(),
  sex: geckoSexSchema.default('unknown'),
  hatchedOn: dateOnly.nullable().optional(),
  photoPath: z.string().min(1).nullable().optional(),
  feedingIntervalDays: z.number().int().positive().nullable().optional(),
});

/**
 * 更新時は全項目任意（渡した項目だけ更新）。create と違い default は持たせない
 * （zod の .partial() は default を保持してしまい、未指定項目が既定値で上書きされるため）。
 */
export const geckoUpdateInputSchema = z.object({
  name: z.string().trim().min(1, '名前は必須です').optional(),
  enclosureId: z.string().min(1).nullable().optional(),
  morph: z.string().trim().min(1).nullable().optional(),
  sex: geckoSexSchema.optional(),
  hatchedOn: dateOnly.nullable().optional(),
  photoPath: z.string().min(1).nullable().optional(),
  feedingIntervalDays: z.number().int().positive().nullable().optional(),
});

export type GeckoCreateInput = z.input<typeof geckoCreateInputSchema>;
export type GeckoUpdateInput = z.input<typeof geckoUpdateInputSchema>;

/** 永続化済みの個体。 */
export interface Gecko {
  id: string;
  ownerId: string;
  enclosureId: string | null;
  name: string;
  morph: string | null;
  sex: GeckoSex;
  hatchedOn: string | null;
  photoPath: string | null;
  feedingIntervalDays: number | null;
  createdAt: string;
  updatedAt: string;
}

export class GeckoNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Gecko not found: ${id}`);
    this.name = 'GeckoNotFoundError';
  }
}

/**
 * 個体データのアクセス層。全メソッドが ownerId を受け取り、
 * 自分の行だけを読み書きできる（Supabase の RLS と同じ制約をコード側でも表現する）。
 */
export interface GeckoRepository {
  list(ownerId: string): Promise<Gecko[]>;
  getById(ownerId: string, id: string): Promise<Gecko | null>;
  create(ownerId: string, input: GeckoCreateInput): Promise<Gecko>;
  update(ownerId: string, id: string, input: GeckoUpdateInput): Promise<Gecko>;
  remove(ownerId: string, id: string): Promise<void>;
}
