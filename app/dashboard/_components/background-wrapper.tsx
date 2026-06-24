'use client';

import { useBackground } from './background-provider';
import { cn } from '@/lib/utils';

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { value } = useBackground();

  const className = cn(
    'flex flex-1 flex-col gap-0 lg:gap-8',
    value
      ? "bg-next bg-sunlight bg-[length:12px_12px] bg-fixed dark:bg-[url('/grid.svg')] dark:bg-auto"
      : 'bg-next',
  );

  return <div className={className}>{children}</div>;
}
