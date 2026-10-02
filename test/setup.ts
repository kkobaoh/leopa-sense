// Jest 共通セットアップ。各テストの前に読み込まれる。
// @testing-library/react-native v12.4+ の組み込みマッチャ（toBeOnTheScreen など）は
// プリセット経由で自動登録されるため、ここでの import は不要。

import { notifyManager } from '@tanstack/react-query';

// TanStack Query は既定で setTimeout による非同期バッチ通知を行う。
// テストではこれがテスト完了後に発火し「act 外更新」警告とタイマー残留
// （worker force exit）を招くため、通知を同期実行に切り替える。
notifyManager.setScheduler((cb) => cb());
