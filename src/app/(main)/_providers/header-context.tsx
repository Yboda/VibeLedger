'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type HeaderConfig = {
  title?: string;
  titleHighlight?: string;
  titleSuffix?: string;
  subtitle?: string;
  description?: string;
  showDate?: boolean;
  action?: ReactNode;
};

type HeaderContextValue = {
  config: HeaderConfig;
  setConfig: (config: HeaderConfig) => void;
};

const HeaderContext = createContext<HeaderContextValue>({
  config: {},
  setConfig: () => {},
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<HeaderConfig>({});
  return (
    <HeaderContext.Provider value={{ config, setConfig }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeaderConfig() {
  return useContext(HeaderContext).config;
}

export function useSetHeader(config: HeaderConfig) {
  const { setConfig } = useContext(HeaderContext);
  const actionRef = useRef(config.action);
  actionRef.current = config.action;

  const {
    title,
    titleHighlight,
    titleSuffix,
    subtitle,
    description,
    showDate,
  } = config;

  useEffect(() => {
    setConfig({
      title,
      titleHighlight,
      titleSuffix,
      subtitle,
      description,
      showDate,
      action: actionRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, titleHighlight, titleSuffix, subtitle, description, showDate]);

  useEffect(() => {
    return () => setConfig({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
