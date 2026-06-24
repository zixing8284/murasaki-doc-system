'use client';
import { useState } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { login } from '@/lib/actions/auth';
import BrandLogo from '@/app/ui/brand-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function LoginForm() {
  const [state, action] = useActionState(login, undefined);
  const { pending } = useFormStatus();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const signal = name !== '' && password !== '';

  return (
    <form action={action}>
      <div className="grid gap-2 text-center">
        <h1 className="py-2 text-3xl font-bold">
          <BrandLogo transSignal={signal} />
        </h1>
        <h2 className="text-md mt-10 text-balance text-center leading-9 tracking-wide text-next-foreground">
          请填写您的账号和密码
        </h2>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">账号</Label>
          <Input
            onChange={(e) => setName(e.target.value)}
            id="name"
            name="name"
            type="text"
            placeholder="输入账号..."
            className="border-hairo"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">密码</Label>
          <Input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            className="border-hairo"
            required
          />
        </div>
        <div
          className="flex h-6 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state?.errors?.name && (
            <>
              <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
              <p className="text-sm/4 text-destructive">{state?.errors.name}</p>
            </>
          )}

          {state?.errors?.password && (
            <>
              <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
              <p className="text-sm/4 text-destructive">
                {state?.errors.password}
              </p>
            </>
          )}

          {state?.message && (
            <>
              <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
              <p className="text-sm/4 text-destructive">{state?.message}</p>
            </>
          )}
        </div>
        <Button
          type="submit"
          className="w-full"
          aria-disabled={pending}
          disabled={pending}
        >
          登录
        </Button>
      </div>
    </form>
  );
}
