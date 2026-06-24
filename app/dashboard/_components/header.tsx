'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  HEADER_NAV_HEIGHT,
  HEADER_TOP_HEIGHT,
  mainNav,
  siteConfig,
} from '@/config/site';
import { logout } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import { Link1Icon as HomeIcon, LockClosedIcon } from '@radix-ui/react-icons';

import FontSwitch from '@/app/ui/font-switch';
import ModeToggle from '@/app/ui/mode-switch';
import StyleSwitch from '@/app/ui/style-switch';
import MobileNav from './mobile-nav';
import MobileMenu from './mobile-menu';

export default function DashboardHeader({
  username,
}: {
  username: string;
}) {
  const pathname = usePathname();

  return (
    <>
      <header className="z-50 w-full max-md:border-b">
        <nav
          className={`mx-auto flex h-${HEADER_TOP_HEIGHT} w-full flex-row justify-between pl-4 pr-6 md:pl-8`}
        >
          <ul className="flex h-full shrink-0 list-none items-center justify-start gap-1 md:gap-0">
            <div className="md:hidden">
              <MobileNav />
            </div>
            <Link
              href="/"
              className="flex space-x-2 text-sm transition-colors hover:text-foreground/80"
            >
              <span className="inline-block p-2 font-noto-serif-sc text-base font-light tracking-wide">
                {siteConfig.name}
              </span>
            </Link>
          </ul>

          {/* ── Desktop controls ── */}
          <div className="hidden justify-start space-x-2 sm:flex">
            <ul className="flex items-center">
              <FontSwitch />
              <StyleSwitch />
              <ModeToggle />
              {/* username */}
              {username && (
                <li className="px-2 text-sm text-muted-foreground">
                  {username}
                </li>
              )}
              {/* logout */}
              <form action={logout}>
                <Button
                  variant="ghost"
                  className="flex grow items-center justify-center gap-2 p-3 text-sm font-medium md:flex-none md:justify-start"
                >
                  <div className="md:block">登出</div>
                </Button>
              </form>
            </ul>
          </div>
          {/* ── Mobile menu ── */}
          <div className="flex items-center sm:hidden">
            {username && (
              <span className="mr-2 text-sm text-muted-foreground">
                {username}
              </span>
            )}
            <MobileMenu />
          </div>
        </nav>
      </header>
      {/* NOTE: sticky relies on its Containing Block, you should NOT wrap it in another div */}
      <div
        className={`sticky top-0 z-50 flex h-${HEADER_NAV_HEIGHT} justify-start overflow-x-auto border-b border-border/90 bg-background/95 pl-8 pr-6 backdrop-blur supports-backdrop-filter:bg-background/60 max-md:hidden`}
      >
        <nav className="flex items-center gap-3 text-sm">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center p-2 font-light tracking-wider transition-all duration-150 hover:bg-muted hover:text-foreground/80 hover:underline hover:decoration-solid hover:underline-offset-8 hover:ease-in',
                pathname.startsWith(item.href)
                  ? 'text-foreground underline decoration-solid underline-offset-8'
                  : 'text-foreground/60',
              )}
              scroll={false}
            >
              {item.superAdminOnly && item.superAdminOnly === true && (
                <LockClosedIcon className="inline-block h-4 w-4 p-1" />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
