'use client';

import { docsSideNavs } from '@/config/site';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export function DocsSideNav() {
  return (
    <nav className="flex shrink-0 flex-col gap-4 text-ellipsis whitespace-nowrap p-1">
      {docsSideNavs.map((section) => {
        return (
          <div key={section.label}>
            <div className="algin-middle flex grow justify-between">
              <NavItem key={section.label} item={section} />
            </div>
          </div>
        );
      })}
    </nav>
  );
}

type Item = { label: string; href: string };

function NavItem({ item }: { item: Item }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      className={clsx('block rounded-md text-sm hover:text-next-foreground', {
        'text-muted-foreground': !isActive,
        'font-medium text-foreground': isActive,
      })}
      scroll={false}
    >
      {item.label}
    </Link>
  );
}
