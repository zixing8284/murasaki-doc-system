'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStyle, type Style } from '@/app/ui/style-provider';
import { useBackground } from './background-provider';
import { logout } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import {
  MoreVertical,
  Check,
  Palette,
  Type,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Grid3X3,
} from 'lucide-react';

export default function MobileMenu() {
  const [mounted, setMounted] = useState(false);
  const [font, setFont] = useLocalStorage('font', 'noto-serif-sc');
  const { style, setStyle } = useStyle();
  const { value: background, toggle: toggleBackground } = useBackground();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">设置菜单</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {/* ── 字体 ── */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Type className="mr-2 h-4 w-4" />
            <span>字体</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="font-noto-serif-sc"
                onClick={() => setFont('noto-serif-sc')}
              >
                {font === 'noto-serif-sc' && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                思源宋体
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-geist-mono"
                onClick={() => setFont('geist-mono')}
              >
                {font === 'geist-mono' && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Geist Mono
              </DropdownMenuItem>
              <DropdownMenuItem
                className="font-noto-sans-sc"
                onClick={() => setFont('noto-sans-sc')}
              >
                {font === 'noto-sans-sc' && (
                  <Check className="mr-2 h-4 w-4" />
                )}
                思源黑体
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* ── 风格 ── */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>风格</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setStyle('zinc')}>
                <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                  {style === 'zinc' && (
                    <Check className="h-4 w-4 text-background" />
                  )}
                </div>
                Zinc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStyle('midori')}>
                <div
                  className="mr-2 flex h-4 w-4 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'hsl(142.1 76.2% 36.3%)' }}
                >
                  {style === 'midori' && (
                    <Check className="h-4 w-4 text-background" />
                  )}
                </div>
                Midori
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleBackground}>
                <Grid3X3 className="mr-2 h-4 w-4" />
                {background ? '隐藏网格背景' : '显示网格背景'}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* ── 主题 ── */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className="mr-2 h-4 w-4" />
            <span>主题</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                亮色
                {theme === 'light' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                暗色
                {theme === 'dark' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Monitor className="mr-2 h-4 w-4" />
                跟随系统
                {theme === 'system' && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* ── 登出 ── */}
        <form action={logout}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              登出
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
