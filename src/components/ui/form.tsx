import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { makeThemedStyles, useTheme } from '@/lib/theme';

// フォーム共通部品（PetForm / FeedingForm で共有）。色はすべてテーマトークン。

/** フォーム全体のコンテナ。 */
export function FormContainer({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <View style={styles.form}>{children}</View>;
}

/** ラベル・必須マーク・エラー文言付きの入力行。 */
export function FormField({
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
  const styles = useStyles();
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

/** テーマ配色のテキスト入力。 */
export function FormTextInput({ style, ...props }: TextInputProps) {
  const styles = useStyles();
  const c = useTheme();
  return (
    <TextInput placeholderTextColor={c.textMuted} {...props} style={[styles.input, style]} />
  );
}

/** チップの横並び（折り返しあり）。 */
export function ChipGroup({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return <View style={styles.chips}>{children}</View>;
}

/** 選択式のチップ。 */
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

/** プライマリ色の送信ボタン。 */
export function SubmitButton({
  label,
  onPress,
  testID,
}: {
  label: string;
  onPress: () => void;
  testID?: string;
}) {
  const styles = useStyles();
  return (
    <Pressable testID={testID} accessibilityRole="button" onPress={onPress} style={styles.submit}>
      <Text style={styles.submitText}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeThemedStyles((c) => ({
  form: { gap: 16, padding: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: c.accent },
  input: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: c.text,
    backgroundColor: c.surface,
  },
  error: { color: c.danger, fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: c.border,
  },
  chipSelected: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { color: c.accent, fontWeight: '600' },
  chipTextSelected: { color: c.onPrimary },
  submit: {
    marginTop: 8,
    backgroundColor: c.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: c.onPrimary, fontSize: 16, fontWeight: '700' },
}));
