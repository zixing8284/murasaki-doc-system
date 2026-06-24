'use client';
import { useEffect } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createDepartmentAndAccount } from '@/lib/actions/account.action';
import { CreateDepartmentFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { CaretSortIcon } from '@radix-ui/react-icons';

import SubmitButton from '../../_components/submit-button';

import type { Department } from '@prisma/client';

const initialState = {
  success: false,
};

export default function CreateDepartmentForm({
  allDepartments,
}: {
  allDepartments: Department[];
}) {
  const [successState, formAction] = useActionState(
    createDepartmentAndAccount,
    initialState,
  );

  const form = useForm<z.infer<typeof CreateDepartmentFormSchema>>({
    resolver: zodResolver(CreateDepartmentFormSchema),
    mode: 'onChange',
    defaultValues: {
      departname: '',
      username: '',
      password: '',
    },
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = form;

  useEffect(() => {
    if (!successState) return;

    if (successState?.success) {
      toast.success('添加成功', {
        duration: 5000,
      });
    }
  }, [successState]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Card className="rounded-lg border-none bg-next">
        <CardHeader>
          <CardTitle className="pb-2 text-lg font-semibold">
            添加分店组织
          </CardTitle>
          <CardDescription>
            添加一个新的组织，名称举例：研发部
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-col items-start lg:w-3/5">
            <Collapsible className="space-y-2 pb-4">
              <CollapsibleTrigger asChild>
                <Button variant="secondary" size="default">
                  <span>已经存在的组织：</span>
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="pl-1 text-sm text-muted-foreground">
                  {allDepartments.map((department) => (
                    <li key={department.id} className="leading-5">
                      {department.name}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>

            <Label htmlFor="departName" className="shrink-0 py-2 leading-7">
              组织名称
            </Label>
            <Input placeholder="" id="departName" {...register('departname')} />
            <p className="text-[0.8rem] font-medium leading-6 text-destructive">
              {errors.departname?.message}
            </p>
            <Label htmlFor="admin" className="shrink-0 py-2 leading-7">
              组织管理员账号名
            </Label>
            <Input placeholder="" id="admin" {...register('username')} />
            <p className="text-sm leading-6 text-muted-foreground">
              账号名必须是全局唯一的，建议使用前缀，比如 rd_admin 代表
              研发部管理员
            </p>

            <p className="text-[0.8rem] font-medium leading-6 text-destructive">
              {errors.username?.message}
            </p>

            <Label htmlFor="password" className="shrink-0 py-2 leading-7">
              账号密码
            </Label>
            <Input
              placeholder=""
              id="password"
              type="password"
              autoComplete="off"
              {...register('password')}
            />

            <p className="text-[0.8rem] font-medium leading-6 text-destructive">
              {errors.password?.message}
            </p>
          </div>
        </CardContent>
        <CardFooter className="ml-auto border-t bg-muted px-6 py-4">
          <div className="flex items-center text-muted-foreground">
            请确保组织名称唯一，否则将无法创建
          </div>
          <div className="ml-auto flex items-center justify-end">
            <SubmitButton text="添加" isValid={isValid} />
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
