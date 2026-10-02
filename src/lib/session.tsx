import { createContext, useContext, type ReactNode } from 'react';

// TODO(auth): Supabase 認証を接続したら、ここで session から user.id を取得する。
// それまでは開発用の固定 owner を使う（オンメモリ DB の行と対応する）。
export const DEV_OWNER_ID = 'dev-owner';

interface SessionValue {
  ownerId: string;
}

const SessionContext = createContext<SessionValue>({ ownerId: DEV_OWNER_ID });

export function SessionProvider({
  ownerId = DEV_OWNER_ID,
  children,
}: {
  ownerId?: string;
  children: ReactNode;
}) {
  return <SessionContext.Provider value={{ ownerId }}>{children}</SessionContext.Provider>;
}

/** 現在ログイン中ユーザーの owner id。全データアクセスのスコープになる。 */
export function useOwnerId(): string {
  return useContext(SessionContext).ownerId;
}
