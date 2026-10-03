import { FlatList, View } from 'react-native';

import type { Gecko } from '@/lib/api';
import { makeThemedStyles } from '@/lib/theme';
import { GeckoCard } from './gecko-card';
import { LoadingState, MessageState } from './ui/screen-state';

export interface GeckoListViewProps {
  isLoading: boolean;
  isError: boolean;
  geckos: Gecko[];
  onSelectGecko?: (id: string) => void;
  /** 各個体の前回給餌日時（ISO）を返す。undefined を返すとバッジ非表示。 */
  lastFedAtOf?: (geckoId: string) => string | null | undefined;
}

/**
 * 個体一覧の見た目（props のみ）。読込中・エラー・空・一覧の 4 状態を描画する。
 * データ取得は呼び出し側（ルート）で useGeckos から渡す。
 */
export function GeckoListView({
  isLoading,
  isError,
  geckos,
  onSelectGecko,
  lastFedAtOf,
}: GeckoListViewProps) {
  const styles = useStyles();

  if (isLoading) return <LoadingState testID="gecko-list-loading" />;

  if (isError) {
    return (
      <MessageState
        testID="gecko-list-error"
        tone="error"
        title="読み込みに失敗しました"
        hint="通信環境を確認してもう一度お試しください"
      />
    );
  }

  if (geckos.length === 0) {
    return (
      <MessageState
        testID="gecko-list-empty"
        title="個体がいません"
        hint="個体を登録するとここに表示されます"
      />
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={geckos}
      keyExtractor={(g) => g.id}
      renderItem={({ item }) => (
        <GeckoCard gecko={item} onPress={onSelectGecko} lastFedAt={lastFedAtOf?.(item.id)} />
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
