import { createContext, useContext, type ReactNode } from 'react';

import { geckoRepo, type GeckoRepository } from './api';

// アプリが使うリポジトリ群を Context で提供する。
// 既定はオンメモリ実装（api/index.ts）。Supabase 接続時や
// テスト時は RepositoryProvider の value で差し替える。
export interface Repositories {
  geckos: GeckoRepository;
}

const defaultRepositories: Repositories = {
  geckos: geckoRepo,
};

const RepositoryContext = createContext<Repositories>(defaultRepositories);

export function RepositoryProvider({
  value,
  children,
}: {
  value?: Partial<Repositories>;
  children: ReactNode;
}) {
  return (
    <RepositoryContext.Provider value={{ ...defaultRepositories, ...value }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useGeckoRepository(): GeckoRepository {
  return useContext(RepositoryContext).geckos;
}
