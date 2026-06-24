'use client';

import { SunIcon, MoonIcon, DesktopIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// TODO: To avoid Layout Shift, consider rendering a skeleton/placeholder until mounted on the client side.
export default function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 在组件首次渲染时，防止在服务器端渲染(SSR)和客户端渲染(CSR)之间产生不一致的内容
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setTheme('dark')}
        variant="ghost"
        className={cn(
          'w-9 px-0',
          theme === 'dark' && 'border border-next-foreground/90',
        )}
      >
        <MoonIcon className="h-4 w-4" />
        <span className="sr-only">set dark theme</span>
      </Button>
      <Button
        onClick={() => setTheme('light')}
        variant="ghost"
        className={cn(
          'w-9 px-0',
          theme === 'light' && 'border border-next-foreground/90',
        )}
      >
        <SunIcon className="h-4 w-4" />
        <span className="sr-only">set light theme</span>
      </Button>
      <Button
        onClick={() => setTheme('system')}
        variant="ghost"
        className={cn(
          'w-9 px-0',
          theme === 'system' && 'border border-next-foreground/90',
        )}
      >
        <DesktopIcon className="h-4 w-4" />
        <span className="sr-only">set light theme</span>
      </Button>
    </>
  );
}
