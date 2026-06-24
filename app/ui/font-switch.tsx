'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const VALID_FONTS = ['noto-serif-sc', 'geist-mono', 'noto-sans-sc'] as const;

export default function FontWrapper() {
  const [font, setFont] = useLocalStorage('font', 'noto-serif-sc');

  // Migrate old HanYi font values to default
  useEffect(() => {
    if (!VALID_FONTS.includes(font as (typeof VALID_FONTS)[number])) {
      setFont('noto-serif-sc');
    }
  }, [font, setFont]);

  // Avoid hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const root = window.document.getElementById(
      'style-container',
    ) as HTMLElement;
    root.classList.remove(
      'font-geist-mono',
      'font-noto-sans-sc',
      'font-noto-serif-sc',
    );
    root.classList.add(`font-${font}`);
  }, [font]);

  useEffect(() => {
    requestAnimationFrame(() => setIsClient(true));
  }, []);

  if (!isClient) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {isClient &&
            {
              'geist-mono': <span className="text-base">Aa</span>,
              'noto-sans-sc': <span className="text-base">黑</span>,
              'noto-serif-sc': <span className="text-base">宋</span>,
            }[font]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="font-noto-serif-sc"
          onClick={() => setFont('noto-serif-sc')}
        >
          思源宋体
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-geist-mono"
          onClick={() => setFont('geist-mono')}
        >
          Geist Mono
        </DropdownMenuItem>
        <DropdownMenuItem
          className="font-noto-sans-sc"
          onClick={() => setFont('noto-sans-sc')}
        >
          思源黑体
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
