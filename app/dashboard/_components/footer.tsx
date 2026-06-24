import Link from 'next/link';
export default function SiteFooter() {
  return (
    <footer className="w-full border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="w-max shrink-0 whitespace-nowrap text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by MURASAKI ©<span suppressHydrationWarning>{new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}
