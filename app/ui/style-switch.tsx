'use client';

import { useEffect, useState } from 'react';
import { useStyle, type Style } from './style-provider';
import { useBackground } from '../dashboard/_components/background-provider';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { ShadowIcon, ShadowNoneIcon } from '@radix-ui/react-icons';

export default function StyleSwitch() {
  const [mounted, setMounted] = useState(false);
  const { style, setStyle } = useStyle();
  const { value: background, toggle: toggleBackground } = useBackground();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {['zinc', 'midori'].map((item) => (
        <Button
          key={item}
          size="icon"
          aria-label={`${item} theme`}
          variant="ghost"
          className={cn(`style-${item}`)}
          onClick={() => {
            setStyle(item as Style);
          }}
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
            {item === style && (
              <CheckIcon
                className={cn(
                  'h-4 w-4',
                  style === item ? 'text-background' : 'text-foreground',
                )}
              />
            )}
          </div>
        </Button>
      ))}

      <Button
        size="icon"
        aria-label="Toggle background"
        variant="ghost"
        onClick={toggleBackground}
      >
        <div className="flex h-4 w-4 items-center justify-center rounded-full">
          {background ? (
            <ShadowIcon className="h-4 w-4" />
          ) : (
            <ShadowNoneIcon className="h-4 w-4" />
          )}
        </div>
      </Button>
    </>
  );
}
