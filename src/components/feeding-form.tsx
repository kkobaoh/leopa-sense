import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, Switch, Text, View } from 'react-native';

import { feedingFormSchema, type FeedingFormValues, type FeedingResult } from '@/lib/api';
import { RESULT_LABEL } from '@/lib/feeding-display';
import { makeThemedStyles, useTheme } from '@/lib/theme';
import {
  Chip,
  ChipGroup,
  FormContainer,
  FormField,
  FormTextInput,
  SubmitButton,
} from './ui/form';

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
  const styles = useStyles();
  const c = useTheme();
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
    <FormContainer>
      <FormField label="餌の種類" required error={errors.foodType?.message}>
        <Controller
          control={control}
          name="foodType"
          render={({ field }) => (
            <View style={styles.fieldBody}>
              <FormTextInput
                testID="feeding-form-foodType"
                placeholder="コオロギ"
                value={field.value ?? ''}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
              />
              <ChipGroup>
                {FOOD_PRESETS.map((food) => (
                  <Chip
                    key={food}
                    label={food}
                    selected={field.value === food}
                    onPress={() => field.onChange(food)}
                  />
                ))}
              </ChipGroup>
            </View>
          )}
        />
      </FormField>

      <FormField label="数">
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
      </FormField>

      <FormField label="食いつき">
        <Controller
          control={control}
          name="result"
          render={({ field }) => (
            <ChipGroup>
              {RESULT_OPTIONS.map((result) => (
                <Chip
                  key={result}
                  label={RESULT_LABEL[result]}
                  selected={field.value === result}
                  onPress={() => field.onChange(result)}
                />
              ))}
            </ChipGroup>
          )}
        />
      </FormField>

      <FormField label="サプリ">
        <Controller
          control={control}
          name="supplement"
          render={({ field }) => (
            <Switch
              testID="feeding-form-supplement"
              value={field.value ?? false}
              onValueChange={field.onChange}
              trackColor={{ true: c.primary, false: c.surfaceAlt }}
            />
          )}
        />
      </FormField>

      <FormField label="メモ">
        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <FormTextInput
              testID="feeding-form-note"
              placeholder="任意"
              value={field.value ?? ''}
              onChangeText={(t) => field.onChange(t === '' ? null : t)}
              onBlur={field.onBlur}
            />
          )}
        />
      </FormField>

      <SubmitButton
        testID="feeding-form-submit"
        label={submitLabel}
        onPress={handleSubmit((values) => onSubmit(values))}
      />
    </FormContainer>
  );
}

const useStyles = makeThemedStyles((c) => ({
  fieldBody: { gap: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: c.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: { color: c.primary, fontSize: 22, fontWeight: '700' },
  stepValue: {
    color: c.text,
    fontSize: 22,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
  },
}));
