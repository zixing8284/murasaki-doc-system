import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { mainNav } from '@/config/site';
import { cn } from '@/lib/utils';
import {
  CrossCircledIcon,
  HamburgerMenuIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  const pathname = usePathname();

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center p-3 font-medium"
      >
        {isOpen ? (
          <CrossCircledIcon className="h-6 w-6" />
        ) : (
          <HamburgerMenuIcon className="h-6 w-6" />
        )}
      </Button>
      <div
        className={clsx('overflow-y-auto lg:static lg:block', {
          'fixed inset-x-0 bottom-0 top-0 z-[9999] bg-background pt-0 text-foreground/90':
            isOpen,
          hidden: !isOpen,
        })}
      >
        <div className="mx-auto flex h-12 w-full shrink-0 list-none flex-row items-center justify-between pl-4 pr-6 md:pl-8">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center bg-transparent p-3 font-medium text-next-foreground/80 hover:bg-transparent hover:text-next-foreground"
          >
            {isOpen ? (
              <CrossCircledIcon className="h-6 w-6" />
            ) : (
              <HamburgerMenuIcon className="h-6 w-6" />
            )}
          </Button>
        </div>
        <nav className="flex-center text-next-foregroundm flex-col space-y-6 px-20 pt-14">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={cn(
                'm-auto w-full whitespace-nowrap p-4 text-center align-baseline leading-3 tracking-wider transition-colors hover:text-next-foreground/80',
                pathname === item.href
                  ? 'text-next-foreground'
                  : 'text-next-foreground/60',
              )}
              scroll={false}
            >
              <div className="text-left">
                <span>
                  {item.label}
                  {item.superAdminOnly && item.superAdminOnly === true && (
                    <LockClosedIcon className="inline-block h-4 w-4 p-1" />
                  )}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
