import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { feedingFormSchema, type FeedingFormValues, type FeedingResult } from '@/lib/api';
import { RESULT_LABEL } from '@/lib/feeding-display';

const RESULT_OPTIONS: FeedingResult[] = ['eaten', 'left', 'refused'];
const FOOD_PRESETS = ['コオロギ', 'デュビア', 'ミルワーム', '人工フード'];

export interface FeedingFormProps {
  /** 前回の内容などを初期値にする。 */
  defaultValues?: Partial<FeedingFormValues>;
  onSubmit: (values: FeedingFormValues) => void | Promise<void>;
  submitLabel?: string;
}

/**
 * 餌やりのクイック入力フォーム。餌（プリセット or 自由入力）・数（ステッパー）・
 * 食いつき（チップ）・サプリ（スイッチ）・メモを数タップで入力する。
 * 記録日時は送信時刻（リポジトリ側で現在時刻を入れる）。
 */
export function FeedingForm({ defaultValues, onSubmit, submitLabel = '記録する' }: FeedingFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedingFormValues>({
    resolver: zodResolver(feedingFormSchema),
    defaultValues: {
      foodType: '',
      quantity: 1,
      result: 'eaten',
      supplement: false,
      note: null,
      ...defaultValues,
    },
  });

  return (
    <View style={styles.form}>
      <Field label="餌の種類" required error={errors.foodType?.message}>
        <Controller
          control={control}
          name="foodType"
          render={({ field }) => (
            <View style={styles.fieldBody}>
              <TextInput
                testID="feeding-form-foodType"
                style={styles.input}
                placeholder="コオロギ"
                value={field.value ?? ''}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <View style={styles.chips}>
                {FOOD_PRESETS.map((food) => {
                  const selected = field.value === food;
                  return (
                    <Pressable
                      key={food}
                      onPress={() => field.onChange(food)}
                      style={[styles.chip, selected && styles.chipSelected]}>
                      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                        {food}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        />
      </Field>

      <Field label="数">
        <Controller
          control={control}
          name="quantity"
          render={({ field }) => {
            const value = field.value ?? 1;
            return (
              <View style={styles.stepper}>
                <Pressable
                  testID="feeding-form-quantity-dec"
                  accessibilityLabel="数を減らす"
                  onPress={() => field.onChange(Math.max(1, value - 1))}
                  style={styles.stepButton}>
                  <Text style={styles.stepButtonText}>−</Text>
                </Pressable>
                <Text testID="feeding-form-quantity" style={styles.stepValue}>
                  {value}
                </Text>
                <Pressable
                  testID="feeding-form-quantity-inc"
                  accessibilityLabel="数を増やす"
                  onPress={() => field.onChange(value + 1)}
                  style={styles.stepButton}>
                  <Text style={styles.stepButtonText}>＋</Text>
                </Pressable>
              </View>
            );
          }}
        />
      </Field>

      <Field label="食いつき">
        <Controller
          control={control}
          name="result"
          render={({ field }) => (
            <View style={styles.chips}>
              {RESULT_OPTIONS.map((result) => {
                const selected = field.value === result;
                return (
                  <Pressable
                    key={result}
                    onPress={() => field.onChange(result)}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {RESULT_LABEL[result]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      </Field>

      <Field label="サプリ">
        <Controller
          control={control}
          name="supplement"
          render={({ field }) => (
            <Switch
              testID="feeding-form-supplement"
              value={field.value ?? false}
              onValueChange={field.onChange}
            />
          )}
        />
      </Field>

      <Field label="メモ">
        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <TextInput
              testID="feeding-form-note"
              style={styles.input}
              placeholder="任意"
              value={field.value ?? ''}
              onChangeText={(t) => field.onChange(t === '' ? null : t)}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>

      <Pressable
        testID="feeding-form-submit"
        accessibilityRole="button"
        onPress={handleSubmit((values) => onSubmit(values))}
        style={styles.submit}>
        <Text style={styles.submitText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16, padding: 16 },
  field: { gap: 6 },
  fieldBody: { gap: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#CBB89D' },
  input: {
    borderWidth: 1,
    borderColor: '#2A2E35',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#F5F5F5',
    backgroundColor: '#1E2127',
  },
  error: { color: '#F07070', fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#2A2E35',
  },
  chipSelected: { backgroundColor: '#F0B65A', borderColor: '#F0B65A' },
  chipText: { color: '#CBB89D', fontWeight: '600' },
  chipTextSelected: { color: '#14161A' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#2A2E35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: { color: '#F0B65A', fontSize: 22, fontWeight: '700' },
  stepValue: { color: '#F5F5F5', fontSize: 22, fontWeight: '700', minWidth: 32, textAlign: 'center' },
  submit: {
    marginTop: 8,
    backgroundColor: '#F0B65A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: '#14161A', fontSize: 16, fontWeight: '700' },
});
