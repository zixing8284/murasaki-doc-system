'use client';

import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import type { ManageNavLink } from '@/config/site';

interface NavProps {
  isCollapsed: boolean;
  links: ManageNavLink[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link) =>
          isCollapsed ? (
            <Tooltip key={link.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.disabled ? '#' : link.href}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: 'icon' }),
                    'h-9 w-9',
                    link.variant === 'default' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
                    link.disabled && 'cursor-not-allowed',
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-xs">{link.label}</span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={link.href}
              href={link.disabled ? '#' : link.href}
              className={cn(
                buttonVariants({ variant: link.variant }),
                'h-9',
                link.variant === 'default' &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start',
                link.disabled && 'cursor-not-allowed',
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    'ml-auto text-xs',
                    link.variant === 'default' &&
                      'text-background dark:text-white',
                  )}
                >
                  {link.label}
                </span>
              )}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
