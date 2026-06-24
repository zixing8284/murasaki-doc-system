'use client';

import { updateSuperAdminAccount } from '@/lib/actions/account.action';
import { UpdateSuperAdminAccountFormSchema } from '@/lib/schemas';
import { logout } from '@/lib/actions/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { type User as PrismaUser } from '@prisma/client';
import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import SubmitButton from '../../_components/submit-button';
import { PasswordInput } from './password-input';

const initialState = {
  success: false,
};

export default function UpdateAccountForm({
  currentUser,
  departmentName,
}: {
  currentUser: Omit<PrismaUser, 'password'> | null;
  departmentName: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [successState, formAction] = useActionState(
    updateSuperAdminAccount,
    initialState,
  );

  const form = useForm<z.infer<typeof UpdateSuperAdminAccountFormSchema>>({
    resolver: zodResolver(UpdateSuperAdminAccountFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: currentUser?.name || '',
      password: '',
      confirmPassword: '',
    },
  });

  // Important: Read the formState before render to subscribe the form state through the Proxy
  const {
    trigger,
    formState: { isValid },
  } = form;

  // If you do not use useFormStatus
  // const onSubmit = async (data: z.infer<typeof UpdateFormSchema>) => formAction(data);

  useEffect(() => {
    if (successState?.success) {
      toast.success('修改成功，即将登出……', {
        duration: 5000,
        onAutoClose: async () => await logout(),
        action: {
          label: '立即登出',
          onClick: () => logout(),
        },
      });
    }
  }, [successState?.success]);

  return (
    <Form {...form}>
      {/* <form onSubmit={form.handleSubmit(onSubmit)}> */}
      {/* Hack for useFormStatus, see dev doc */}
      <form
        ref={formRef}
        onSubmit={(e) => {
          trigger();
          if (isValid) {
            console.log('submit');
            formRef.current?.requestSubmit();
          } else {
            e.preventDefault();
          }
        }}
        action={formAction}
      >
        <div className="relative p-6">
          <h4 className="pb-4 text-lg font-semibold">当前账户</h4>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-secondary-foreground">
                    账号
                  </FormLabel>
                  <div className="inline-flex w-full lg:w-2/4">
                    <div className="flex select-none items-center border-2 border-r-0 border-sunlight bg-muted px-3 text-sm leading-4 text-muted-foreground dark:border-hairo">
                      <span className="inline-block min-w-0 max-w-full truncate break-keep">
                        {departmentName}
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={currentUser?.name}
                        {...field}
                        className="w-full"
                        autoComplete="off"
                      />
                    </FormControl>
                  </div>
                  <FormDescription className="text-sm">
                    这是您用来登录的账户名称
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="text-secondary-foreground">
                      设置新密码
                    </FormLabel>
                    <div className="w-full lg:w-2/4">
                      <FormControl>
                        <PasswordInput
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="text-sm">
                      这将是您新的登录密码
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel className="text-secondary-foreground">
                      确认新密码
                    </FormLabel>
                    <div className="w-full lg:w-2/4">
                      <FormControl>
                        <PasswordInput
                          placeholder="******"
                          {...field}
                          className="w-full"
                          autoComplete="new-password"
                        />
                      </FormControl>
                    </div>
                    <FormDescription className="text-sm">
                      请确认两次输入的密码一致
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
          </div>
        </div>

        <footer className="flex min-h-14 items-center border-t border-sunlight bg-muted px-6 py-3 text-sm leading-6 text-muted-foreground dark:border-hairo">
          <div className="flex items-center">
            您的账户名称不能与已存在的账号名称重复，否则修改将不会生效
          </div>
          <div className="ml-auto flex items-center justify-end">
            <SubmitButton text="应用修改" />
          </div>
        </footer>
      </form>
    </Form>
  );
}
