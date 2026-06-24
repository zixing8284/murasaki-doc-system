import { cn } from '@/lib/utils';

export default function BrandLogo({
  transSignal = false,
}: {
  transSignal: Boolean;
}) {
  return (
    <span
      style={{
        height: '72px',
      }}
      className={cn(
        'inline-flex items-center justify-center px-2 font-noto-serif-sc text-4xl font-medium tracking-widest text-green-600 duration-500 dark:text-green-400',
        transSignal
          ? 'rotate-[360deg] transition-transform'
          : 'transition-transform',
      )}
    >
      MURASAKI
    </span>
  );
}
