import Link from 'next/link';
import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { DoubleArrowRightIcon } from '@radix-ui/react-icons';

export default function OverView() {
  return (
    <main className="container relative flex-1 grow items-start py-6 lg:py-8 xl:grid">
      <div className="flex min-h-96 flex-col justify-between">
        <div className="box-border w-full max-w-fit pb-20 pr-12 pt-12">
          <h1 className="pb-2 text-4xl">欢迎使用 MURASAKI 文档管理系统!</h1>
          <Link
            className={cn(
              badgeVariants({ variant: 'default' }),
              'mb-8 mt-8 flex w-fit items-center p-2 pr-1',
            )}
            href="/dashboard/docs"
          >
            <h1 className="leading-6">了解下新版本</h1>
            <DoubleArrowRightIcon className="ml-2" />
          </Link>
        </div>
      </div>
    </main>
  );
}
