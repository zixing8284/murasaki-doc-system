'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Style = 'zinc' | 'midori';

type StyleProviderProps = {
  children: React.ReactNode;
  defaultStyle?: Style;
  storageKey?: string;
};

type StyleProviderState = {
  style: Style;
  setStyle: (style: Style) => void;
};

const initialState: StyleProviderState = {
  style: 'zinc',
  setStyle: () => null,
};

const ISSERVER = typeof window === 'undefined';

const StyleProviderContext = createContext<StyleProviderState>(initialState);

export function StyleProvider({
  children,
  defaultStyle = 'zinc',
  storageKey = 'ui-style',
  ...props
}: StyleProviderProps) {
  const [style, setStyle] = useState<Style>(() => {
    if (ISSERVER) return defaultStyle;
    return (localStorage.getItem(storageKey) as Style) || defaultStyle;
  });

  const value = {
    style,
    setStyle: (style: Style) => {
      localStorage.setItem(storageKey, style);
      setStyle(style);
    },
  };

  // Avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsClient(true));
  }, []);

  if (!isClient) return null;

  return (
    <StyleProviderContext.Provider {...props} value={value}>
      <div
        className={`style-${style} flex h-full min-h-screen min-w-0 flex-col bg-background`}
      >
        {children}
      </div>
    </StyleProviderContext.Provider>
  );
}

export const useStyle = () => {
  const context = useContext(StyleProviderContext);

  if (context === undefined)
    throw new Error('useStyle must be used within a StyleProvider');

  return context;
};
