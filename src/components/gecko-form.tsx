import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { geckoCreateInputSchema, type GeckoCreateInput, type GeckoSex } from '@/lib/api';

const SEX_OPTIONS: { value: GeckoSex; label: string }[] = [
  { value: 'male', label: 'オス' },
  { value: 'female', label: 'メス' },
  { value: 'unknown', label: '不明' },
];

export interface GeckoFormProps {
  defaultValues?: Partial<GeckoCreateInput>;
  onSubmit: (values: GeckoCreateInput) => void | Promise<void>;
  submitLabel?: string;
}

export function GeckoForm({ defaultValues, onSubmit, submitLabel = '保存' }: GeckoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GeckoCreateInput>({
    resolver: zodResolver(geckoCreateInputSchema),
    defaultValues: {
      name: '',
      morph: null,
      sex: 'unknown',
      hatchedOn: null,
      feedingIntervalDays: null,
      ...defaultValues,
    },
  });

  return (
    <View style={styles.form}>
      <Field label="名前" required error={errors.name?.message} errorTestID="gecko-form-name-error">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextInput
              testID="gecko-form-name"
              style={styles.input}
              placeholder="レオ"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>

      <Field label="モルフ" error={errors.morph?.message} errorTestID="gecko-form-morph-error">
        <Controller
          control={control}
          name="morph"
          render={({ field }) => (
            <TextInput
              testID="gecko-form-morph"
              style={styles.input}
              placeholder="ハイイエロー"
              value={field.value ?? ''}
              onChangeText={(t) => field.onChange(t === '' ? null : t)}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>

      <Field label="性別">
        <Controller
          control={control}
          name="sex"
          render={({ field }) => (
            <View style={styles.chips}>
              {SEX_OPTIONS.map((opt) => {
                const selected = field.value === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => field.onChange(opt.value)}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        />
      </Field>

      <Field
        label="生年月日 (YYYY-MM-DD)"
        error={errors.hatchedOn?.message}
        errorTestID="gecko-form-hatchedOn-error">
        <Controller
          control={control}
          name="hatchedOn"
          render={({ field }) => (
            <TextInput
              testID="gecko-form-hatchedOn"
              style={styles.input}
              placeholder="2024-06-01"
              autoCapitalize="none"
              value={field.value ?? ''}
              onChangeText={(t) => field.onChange(t === '' ? null : t)}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>

      <Field
        label="給餌間隔 (日)"
        error={errors.feedingIntervalDays?.message}
        errorTestID="gecko-form-feedingIntervalDays-error">
        <Controller
          control={control}
          name="feedingIntervalDays"
          render={({ field }) => (
            <TextInput
              testID="gecko-form-feedingIntervalDays"
              style={styles.input}
              placeholder="7"
              keyboardType="number-pad"
              value={field.value == null ? '' : String(field.value)}
              onChangeText={(t) => field.onChange(t === '' ? null : Number(t))}
              onBlur={field.onBlur}
            />
          )}
        />
      </Field>

      <Pressable
        testID="gecko-form-submit"
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
  errorTestID,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  errorTestID?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      {children}
      {error ? (
        <Text testID={errorTestID} style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16, padding: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: '#4A3B2C' },
  input: {
    borderWidth: 1,
    borderColor: '#CBB89D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: { color: '#D64545', fontSize: 12 },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#CBB89D',
  },
  chipSelected: { backgroundColor: '#E8A33D', borderColor: '#E8A33D' },
  chipText: { color: '#4A3B2C', fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },
  submit: {
    marginTop: 8,
    backgroundColor: '#E8A33D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
