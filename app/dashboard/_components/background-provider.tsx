'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const BackgroundContext = createContext({
  value: true,
  toggle: () => {},
});

const BackgroundProvider = ({ children }: { children: React.ReactNode }) => {
  const [background, setBackground] = useLocalStorage('background', true);

  const toggle = useCallback(() => setBackground(!background), [background, setBackground]);

  const contextValue = useMemo(
    () => ({ value: background, toggle }),
    [background, toggle],
  );

  return (
    <BackgroundContext.Provider value={contextValue}>
      {children}
    </BackgroundContext.Provider>
  );
};

const useBackground = () => useContext(BackgroundContext);

export { BackgroundProvider, useBackground };
