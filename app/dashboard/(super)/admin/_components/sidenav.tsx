'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminSideNavs } from '@/config/site';

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  const Redirect = (value: string) => {
    const nav = adminSideNavs.find((nav) => nav.label === value);
    if (nav) {
      router.push(nav.href);
    }
  };
  const activeNav = adminSideNavs.find((nav) => nav.href === pathname);

  return (
    <>
      <div className="mr-12 hidden max-w-full md:block md:w-60">
        {adminSideNavs.map((nav) => (
          <Link
            key={nav.label}
            href={nav.href}
            className={clsx(
              'mb-2 block rounded-md px-[12px] py-[10px] text-sm hover:bg-muted hover:text-muted-foreground',
              {
                'text-muted-foreground': pathname !== nav.href,
                'bg-muted font-medium text-foreground': pathname === nav.href,
              },
            )}
          >
            {nav.label}
          </Link>
        ))}
      </div>
      {/* dropdown menu in mobile view */}
      <div className="block md:hidden">
        <Select value={activeNav?.label} onValueChange={Redirect}>
          <SelectTrigger className="bg-background">
            <SelectValue>{activeNav?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {adminSideNavs.map((nav) => (
              <SelectItem key={nav.label} value={nav.label} className="py-4">
                {nav.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
