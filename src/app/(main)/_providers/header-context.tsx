'use client';

import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export type HeaderConfig = {
  title?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle?: string;
  description?: string;
  showDate?: boolean;
  titleLoading?: boolean;
  action?: ReactNode;
};

const HeaderConfigContext = createContext<HeaderConfig | null>(null);
const HeaderSetConfigContext = createContext<Dispatch<
  SetStateAction<HeaderConfig>
> | null>(null);

function configKey(config: HeaderConfig): string {
  return [
    config.title ?? '',
    config.titleHighlight ?? '',
    config.titleSuffix ?? '',
    config.subtitle ?? '',
    config.description ?? '',
    config.showDate ? '1' : '0',
    config.titleLoading ? '1' : '0',
  ].join('|');
}

function isSameConfig(a: HeaderConfig, b: HeaderConfig): boolean {
  return configKey(a) === configKey(b) && a.action === b.action;
}

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>({});

  return (
    <HeaderSetConfigContext.Provider value={setConfig}>
      <HeaderConfigContext.Provider value={config}>
        {children}
      </HeaderConfigContext.Provider>
    </HeaderSetConfigContext.Provider>
  );
}

export function useHeaderConfig() {
  const config = useContext(HeaderConfigContext);
  if (config === null) {
    throw new Error('useHeaderConfig must be used within HeaderProvider');
  }
  return config;
}

export function useSetHeader({
  title,
  titleHighlight,
  titleSuffix,
  subtitle,
  description,
  showDate,
  titleLoading,
  action,
}: HeaderConfig) {
  const setConfig = useContext(HeaderSetConfigContext);
  if (!setConfig) {
    throw new Error('useSetHeader must be used within HeaderProvider');
  }

  useLayoutEffect(() => {
    const nextConfig: HeaderConfig = {
      title,
      titleHighlight,
      titleSuffix,
      subtitle,
      description,
      showDate,
      titleLoading,
      action,
    };

    setConfig(prev => (isSameConfig(prev, nextConfig) ? prev : nextConfig));

    return () => setConfig({});
  }, [
    title,
    titleHighlight,
    titleSuffix,
    subtitle,
    description,
    showDate,
    titleLoading,
    action,
    setConfig,
  ]);
}
