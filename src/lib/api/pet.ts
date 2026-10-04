import { z } from 'zod';

// 個体（ペット）のドメインモデルとバリデーション。
// DB は snake_case だが、アプリ内は camelCase に統一し、
// Supabase 実装の境界（lib/api 内）だけでマッピングする方針。

export const petSexSchema = z.enum(['male', 'female', 'unknown']);
export type PetSex = z.infer<typeof petSexSchema>;

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD 形式で入力してください');

/** 個体作成時の入力。name 以外は任意。 */
export const petCreateInputSchema = z.object({
  name: z.string().trim().min(1, '名前は必須です'),
  enclosureId: z.string().min(1).nullable().optional(),
  morph: z.string().trim().min(1).nullable().optional(),
  sex: petSexSchema.default('unknown'),
  hatchedOn: dateOnly.nullable().optional(),
  photoPath: z.string().min(1).nullable().optional(),
  feedingIntervalDays: z.number().int().positive().nullable().optional(),
});

/**
 * 更新時は全項目任意（渡した項目だけ更新）。create と違い default は持たせない
 * （zod の .partial() は default を保持してしまい、未指定項目が既定値で上書きされるため）。
 */
export const petUpdateInputSchema = z.object({
  name: z.string().trim().min(1, '名前は必須です').optional(),
  enclosureId: z.string().min(1).nullable().optional(),
  morph: z.string().trim().min(1).nullable().optional(),
  sex: petSexSchema.optional(),
  hatchedOn: dateOnly.nullable().optional(),
  photoPath: z.string().min(1).nullable().optional(),
  feedingIntervalDays: z.number().int().positive().nullable().optional(),
});

export type PetCreateInput = z.input<typeof petCreateInputSchema>;
export type PetUpdateInput = z.input<typeof petUpdateInputSchema>;

/** 永続化済みの個体。 */
export interface Pet {
  id: string;
  ownerId: string;
  enclosureId: string | null;
  name: string;
  morph: string | null;
  sex: PetSex;
  hatchedOn: string | null;
  photoPath: string | null;
  feedingIntervalDays: number | null;
  createdAt: string;
  updatedAt: string;
}

export class PetNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Pet not found: ${id}`);
    this.name = 'PetNotFoundError';
  }
}

/**
 * 個体データのアクセス層。全メソッドが ownerId を受け取り、
 * 自分の行だけを読み書きできる（Supabase の RLS と同じ制約をコード側でも表現する）。
 */
export interface PetRepository {
  list(ownerId: string): Promise<Pet[]>;
  getById(ownerId: string, id: string): Promise<Pet | null>;
  create(ownerId: string, input: PetCreateInput): Promise<Pet>;
  update(ownerId: string, id: string, input: PetUpdateInput): Promise<Pet>;
  remove(ownerId: string, id: string): Promise<void>;
}
