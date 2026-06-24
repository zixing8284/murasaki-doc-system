'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Error() {
  const router = useRouter();

  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
      <h1 className="text-[7rem] font-bold leading-tight">403</h1>
      <span className="font-medium">抱歉!您没有足够的权限 {`:')`}</span>
      <p className="text-center text-muted-foreground">
        您没有足够的权限访问此页面。
        <br />
        如果您认为这是一个错误，请尝试重新登录或联系管理员。
      </p>
      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
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
