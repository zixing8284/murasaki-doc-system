import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import LoadingDots from '@/app/ui/icons/loading-dots';
import { PlateEditor } from '@/components/editor/plate-editor';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { createPostFromTemplate } from '@/lib/actions/post.action';
import { PostFromTemplateFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { MixIcon } from '@radix-ui/react-icons';

import type { PostCategory, Template } from '@prisma/client';

export function CreatePostFromTemplateButton({
  postCategories,
  templates,
}: {
  postCategories: PostCategory[];
  templates: Template[];
}) {
  const [selectedTemplateContent, setSelectedTemplateContent] =
    useState(undefined);
  const [key, setKey] = useState(0);

  const form = useForm<
    z.input<typeof PostFromTemplateFormSchema>,
    any,
    z.output<typeof PostFromTemplateFormSchema>
  >({
    resolver: zodResolver(PostFromTemplateFormSchema),
    mode: 'onChange',
    defaultValues: {
      published: false,
      content: undefined,
    },
  });
  const { reset } = form;

  const [isPendingCreate, startCreateTransition] = useTransition();

  const router = useRouter();

  function onSubmit(data: z.output<typeof PostFromTemplateFormSchema>) {
    startCreateTransition(async () => {
      console.log('123');
      const post = await createPostFromTemplate({
        templateId: data.templateId,
        categoryId: data.categoryId,
        carriedContent: JSON.stringify(selectedTemplateContent),
      });

      router.refresh();
      router.push(`/dashboard/manage/post/${post.id}`);
    });
  }

  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
          setSelectedTemplateContent(undefined);
          setKey((prev) => prev + 1);
          reset();
        }}
      >
        <DialogTrigger asChild>
          <Button
            className="flex h-max w-full flex-col items-start justify-start sm:w-auto sm:min-w-61.5"
            variant="outline"
          >
            <div className="flex w-full flex-row items-center justify-between space-y-0 py-2">
              <p className="text-sm">选择模板</p>

              <MixIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              选择模板并创建一个记录
            </p>
          </Button>
        </DialogTrigger>

        <DialogContent className="min-w-0 md:max-w-[768px]">
          {templates.length === 0 && (
            <div>没有模板，您需要等待总管理员添加模板</div>
          )}

          {templates.length > 0 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex h-[640px] flex-row gap-4 p-2">
                  <div className="flex-1">
                    <div className="h-full overflow-auto text-sm text-muted-foreground">
                      <PlateEditor
                        key={key}
                        value={selectedTemplateContent}
                        readOnly
                        variant="viewer"
                        className="border-none bg-transparent px-0 shadow-none focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="flex h-full w-[240px] flex-col gap-2 pt-4">
                    <FormField
                      control={form.control}
                      name="templateId"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="font-semibold text-primary">
                            选择模板
                          </FormLabel>
                          <FormMessage />

                          <FormControl>
                            <nav className="flex h-full flex-col justify-start gap-4 overflow-auto text-sm text-muted-foreground">
                              <RadioGroup
                                className="flex flex-1 flex-col justify-start"
                                value={field.value}
                                onValueChange={(value: string) => {
                                  field.onChange(value);
                                  const is = templates.find(
                                    (template) => template.id === value,
                                  );
                                  setSelectedTemplateContent(() =>
                                    is ? JSON.parse(is.content!) : undefined,
                                  );
                                  setKey((prev) => prev + 1);
                                }}
                              >
                                {templates.map((template) => (
                                  <FormItem key={template.id}>
                                    <FormControl>
                                      <RadioGroupItem
                                        value={template.id}
                                        className="peer sr-only"
                                      />
                                    </FormControl>

                                    <FormLabel className="flex w-full flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent py-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                      {template.name}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </nav>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-primary">
                            选择目录
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="选择一个目录" />
                              </SelectTrigger>

                              {postCategories.length > 0 && (
                                <SelectContent>
                                  {postCategories.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              )}
                            </Select>
                          </FormControl>

                          <FormMessage />

                          {postCategories.length === 0 && (
                            <div className="p-2 text-xs text-destructive">
                              没有目录，您需要等待总管理员添加目录
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      console.log(form.formState);
                    }}
                  >
                    {isPendingCreate ? (
                      <LoadingDots color="#808080" />
                    ) : (
                      '使用此模板'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
