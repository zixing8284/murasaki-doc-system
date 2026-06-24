'use client';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useTransition } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
import { createPostCategory } from '@/lib/actions/post.action';
import { CreateFileCategoryFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

const initialState = {
  success: false,
};

export default function CreatePostCategory() {
  const form = useForm<z.infer<typeof CreateFileCategoryFormSchema>>({
    resolver: zodResolver(CreateFileCategoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const {
    formState: { isValid },
    reset,
  } = form;

  const [pending, startTransition] = useTransition();
  const [successState, formAction] = useActionState(
    createPostCategory,
    initialState,
  );

  useEffect(() => {
    if (!successState) {
      return;
    }
    if (successState.success) {
      toast.success('目录创建成功', {
        description: new Date().toLocaleString(),
      });
      requestAnimationFrame(() => {
        reset();
      });
    }
  }, [successState, reset]);

  return (
    <Form {...form}>
      <form
        action={(formData) => startTransition(() => formAction(formData))}
        className="w-full space-y-6 lg:w-2/3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel className="">添加目录</FormLabel>
              <FormControl>
                <Input placeholder="目录名称" {...field} />
              </FormControl>

              <FormDescription className="text-right">
                目录名称必须为中文、英文或数字字符。
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="item-center float-right flex justify-center"
          aria-disabled={pending}
          disabled={pending || !isValid}
        >
          <span>添加</span>
          {pending ? (
            <LoaderCircle className="ml-1 h-4 w-4 animate-spin" />
          ) : null}
        </Button>
      </form>
    </Form>
  );
}
