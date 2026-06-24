import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-245 flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            未找到页面…… <br className="hidden sm:inline" />
            你似乎访问了一个不存在的页面。
          </h1>
          <p className="max-w-193.75 text-lg text-muted-foreground">
            当前的页面不存在或者已经被删除，请检查链接是否正确，你可以返回首页或者查看文档。
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href={siteConfig.links.home}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonVariants()}
          >
            帮助文档
          </Link>
        </div>
      </section>
    </>
  );
}
