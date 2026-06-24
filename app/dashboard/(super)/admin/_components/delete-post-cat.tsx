'use client';

import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { deletePostCategory } from '@/lib/actions/post.action';
import { DeletePostCategoryFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import type { PostCategory } from '@prisma/client';

export default function DeletePostCategory({
  postCategories,
}: {
  postCategories: PostCategory[];
}) {
  const form = useForm<z.infer<typeof DeletePostCategoryFormSchema>>({
    resolver: zodResolver(DeletePostCategoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isValid },
  } = form;

  const deletePostCategoryWithName = deletePostCategory.bind(
    null,
    getValues().name,
  );

  const [pending, setPending] = useState(false);
  const router = useRouter();

  return (
    <>
      {postCategories.length === 0 ? (
        <div>没有目录</div>
      ) : (
        <Form {...form}>
          <form
            className="w-full space-y-6 lg:w-2/3"
            onSubmit={handleSubmit(async () => {
              setPending(true);
              const { success } = await deletePostCategoryWithName();
              if (success) {
                toast.success('目录已删除', {
                  description: new Date().toLocaleString(),
                });
                router.refresh();
              }
              reset();
              setPending(false);
            })}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel htmlFor="name">删除目录</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger id="name">
                        <SelectValue placeholder="选择一个目录" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {postCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-right">
                    删除后，原属该目录的记录将变为无目录状态
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={!isValid || pending}
              className="float-right flex items-center justify-center data-dsiabled:cursor-not-allowed"
            >
              <span>删除</span>
              {pending ? (
                <LoaderCircle className="ml-1 h-4 w-4 animate-spin" />
              ) : null}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
