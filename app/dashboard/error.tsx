'use client'; // Error components must be Client Components

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

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
      <h1 className="text-[7rem] font-bold leading-tight">400 / 500</h1>
      <span className="font-medium">糟糕！出了点问题 {`:')`}</span>
      <p className="text-center text-muted-foreground">
        问题原因：{error.message}
      </p>
      <p className="py-2 text-center text-muted-foreground">
        如果您正在填写表单，请确认您的输入是否正确。
        <br />
        或者，是我们的服务出现了问题。
        <br />
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
