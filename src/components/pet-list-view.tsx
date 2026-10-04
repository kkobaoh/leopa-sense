import { FlatList, View } from 'react-native';

import type { Pet } from '@/lib/api';
import { makeThemedStyles } from '@/lib/theme';
import { PetCard } from './pet-card';
import { LoadingState, MessageState } from './ui/screen-state';

export interface PetListViewProps {
  isLoading: boolean;
  isError: boolean;
  pets: Pet[];
  onSelectPet?: (id: string) => void;
  /** 各個体の前回給餌日時（ISO）を返す。undefined を返すとバッジ非表示。 */
  lastFedAtOf?: (petId: string) => string | null | undefined;
}

/**
 * 個体一覧の見た目（props のみ）。読込中・エラー・空・一覧の 4 状態を描画する。
 * データ取得は呼び出し側（ルート）で usePets から渡す。
 */
export function PetListView({
  isLoading,
  isError,
  pets,
  onSelectPet,
  lastFedAtOf,
}: PetListViewProps) {
  const styles = useStyles();

  if (isLoading) return <LoadingState testID="pet-list-loading" />;

  if (isError) {
    return (
      <MessageState
        testID="pet-list-error"
        tone="error"
        title="読み込みに失敗しました"
        hint="通信環境を確認してもう一度お試しください"
      />
    );
  }

  if (pets.length === 0) {
    return (
      <MessageState
        testID="pet-list-empty"
        title="個体がいません"
        hint="個体を登録するとここに表示されます"
      />
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={pets}
      keyExtractor={(g) => g.id}
      renderItem={({ item }) => (
        <PetCard pet={item} onPress={onSelectPet} lastFedAt={lastFedAtOf?.(item.id)} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const useStyles = makeThemedStyles((c) => ({
  list: { flex: 1, backgroundColor: c.background },
  listContent: { padding: 16 },
  separator: { height: 12 },
}));
