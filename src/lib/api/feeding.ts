import { z } from 'zod';

// 餌やり記録のドメインモデルとバリデーション。pet と同じく camelCase で統一。

export const feedingResultSchema = z.enum(['eaten', 'left', 'refused']);
export type FeedingResult = z.infer<typeof feedingResultSchema>; // 完食 / 残し / 拒食

/** 餌やり作成時の入力。petId と foodType は必須。occurredAt 省略時はリポジトリが現在時刻を入れる。 */
export const feedingCreateInputSchema = z.object({
  petId: z.string().min(1),
  occurredAt: z.string().min(1).optional(),
  foodType: z.string().trim().min(1, '餌の種類は必須です'),
  quantity: z.number().int().positive().default(1),
  result: feedingResultSchema.default('eaten'),
  supplement: z.boolean().default(false),
  note: z.string().trim().min(1).nullable().optional(),
});

// 更新は全項目任意。create と違い default は持たせない
// （zod の .partial() は default を保持してしまい、未指定項目が既定値で上書きされるため）。
export const feedingUpdateInputSchema = z.object({
  petId: z.string().min(1).optional(),
  occurredAt: z.string().min(1).optional(),
  foodType: z.string().trim().min(1).optional(),
  quantity: z.number().int().positive().optional(),
  result: feedingResultSchema.optional(),
  supplement: z.boolean().optional(),
  note: z.string().trim().min(1).nullable().optional(),
});

export type FeedingCreateInput = z.input<typeof feedingCreateInputSchema>;
export type FeedingUpdateInput = z.input<typeof feedingUpdateInputSchema>;

// フォーム用: petId は画面側で付与するためフォームには含めない。
export const feedingFormSchema = feedingCreateInputSchema.omit({ petId: true });
export type FeedingFormValues = z.input<typeof feedingFormSchema>;

export interface Feeding {
  id: string;
  ownerId: string;
  petId: string;
  occurredAt: string;
  foodType: string;
  quantity: number;
  result: FeedingResult;
  supplement: boolean;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export class FeedingNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Feeding not found: ${id}`);
    this.name = 'FeedingNotFoundError';
  }
}

/**
 * 餌やりデータのアクセス層。全メソッドが ownerId を受け取り、自分の行だけを扱う
 * （Supabase の RLS 相当の制約をコード側でも表現する）。
 */
export interface FeedingRepository {
  list(ownerId: string): Promise<Feeding[]>;
  /** 指定個体の記録を occurredAt 降順（新しい順）で返す。 */
  listByPet(ownerId: string, petId: string): Promise<Feeding[]>;
  /** 指定個体の最新の記録。なければ null。 */
  latestForPet(ownerId: string, petId: string): Promise<Feeding | null>;
  getById(ownerId: string, id: string): Promise<Feeding | null>;
  create(ownerId: string, input: FeedingCreateInput): Promise<Feeding>;
  update(ownerId: string, id: string, input: FeedingUpdateInput): Promise<Feeding>;
  remove(ownerId: string, id: string): Promise<void>;
}
