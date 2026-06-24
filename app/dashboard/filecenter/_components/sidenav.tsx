'use client';

import { filecenterSideNavs, type Item } from '@/config/site';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  return (
    <div className="w-full">
      <nav className="px-2 pb-24">
        {filecenterSideNavs.map((section) => {
          return (
            <div key={section.name}>
              <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400/80">
                <div>{section.name}</div>
              </div>

              <div className="algin-middle flex grow flex-col justify-between">
                {section.items.map((item) => (
                  <NavItem key={item.slug} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function NavItem({ item }: { item: Item }) {
  const pathname = usePathname();
  console.log(pathname);
  const isActive = pathname.includes(item.slug);

  return (
    <Link
      href={`/dashboard/filecenter/${item.slug}`}
      className={clsx(
        'block rounded-md px-3 py-2 text-sm hover:bg-next-foreground hover:text-next',
        {
          'text-muted-foreground': !isActive,
          'font-medium text-foreground': isActive,
        },
      )}
      scroll={false}
    >
      {item.name}
    </Link>
  );
}
