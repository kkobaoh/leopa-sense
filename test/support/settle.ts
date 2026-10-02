import { act } from '@testing-library/react-native';

/**
 * react-hook-form の submit 後に遅れて走る非同期更新を、アンマウント前に
 * act 内で流し切る。無効 submit（バリデーションエラー）のテスト末尾で呼ぶと、
 * 保留更新が次テストの render を壊すのを防げる。
 *
 * 注意: 「成功 submit（onSubmit 呼び出し）」はこの flush では回収できず、
 * React 19 の react-native test-renderer を壊すため、成功 submit を伴うテストは
 * ファイルの最後に 1 本だけ置くこと。
 * 参考: https://github.com/orgs/react-hook-form/discussions/4232
 */
export async function settle(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}
