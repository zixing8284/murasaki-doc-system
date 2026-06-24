'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error({ error });
  }, [error]);

  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
      <h1 className="text-[7rem] font-bold leading-tight">500</h1>
      <span className="font-medium">糟糕！出了点问题 {`:')`}</span>
      <p className="text-center text-muted-foreground">
        您看到了此页面，抱歉，很有可能是我们的服务出现了问题。 <br />
        您可以尝试重新加载页面。如果问题依然存在，请将问题反馈给我们，我们会尽快解决。
      </p>
      <div className="mt-6 flex gap-4">
        <Button
          variant="outline"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          返回
        </Button>
        <Button
          onClick={
            // Redirect to the home page
            () => router.push('/dashboard')
          }
        >
          回到首页
        </Button>
      </div>
    </div>
  );
}
