import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { geckoCreateInputSchema, type GeckoCreateInput, type GeckoSex } from '@/lib/api';
import {
  Chip,
  ChipGroup,
  FormContainer,
  FormField,
  FormTextInput,
  SubmitButton,
} from './ui/form';

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
    <FormContainer>
      <FormField
        label="名前"
        required
        error={errors.name?.message}
        errorTestID="gecko-form-name-error">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <FormTextInput
              testID="gecko-form-name"
              placeholder="レオ"
              value={field.value ?? ''}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </FormField>

      <FormField label="モルフ" error={errors.morph?.message} errorTestID="gecko-form-morph-error">
        <Controller
          control={control}
          name="morph"
          render={({ field }) => (
            <FormTextInput
              testID="gecko-form-morph"
              placeholder="ハイイエロー"
              value={field.value ?? ''}
              onChangeText={(t) => field.onChange(t === '' ? null : t)}
              onBlur={field.onBlur}
            />
          )}
        />
      </FormField>

      <FormField label="性別">
        <Controller
          control={control}
          name="sex"
          render={({ field }) => (
            <ChipGroup>
              {SEX_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={field.value === opt.value}
                  onPress={() => field.onChange(opt.value)}
                />
              ))}
            </ChipGroup>
          )}
        />
      </FormField>

      <FormField
        label="生年月日 (YYYY-MM-DD)"
        error={errors.hatchedOn?.message}
        errorTestID="gecko-form-hatchedOn-error">
        <Controller
          control={control}
          name="hatchedOn"
          render={({ field }) => (
            <FormTextInput
              testID="gecko-form-hatchedOn"
              placeholder="2024-06-01"
              autoCapitalize="none"
              value={field.value ?? ''}
              onChangeText={(t) => field.onChange(t === '' ? null : t)}
              onBlur={field.onBlur}
            />
          )}
        />
      </FormField>

      <FormField
        label="給餌間隔 (日)"
        error={errors.feedingIntervalDays?.message}
        errorTestID="gecko-form-feedingIntervalDays-error">
        <Controller
          control={control}
          name="feedingIntervalDays"
          render={({ field }) => (
            <FormTextInput
              testID="gecko-form-feedingIntervalDays"
              placeholder="7"
              keyboardType="number-pad"
              value={field.value == null ? '' : String(field.value)}
              onChangeText={(t) => field.onChange(t === '' ? null : Number(t))}
              onBlur={field.onBlur}
            />
          )}
        />
      </FormField>

      <SubmitButton
        testID="gecko-form-submit"
        label={submitLabel}
        onPress={handleSubmit((values) => onSubmit(values))}
      />
    </FormContainer>
  );
}
