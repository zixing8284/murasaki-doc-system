'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  createFileCategory,
  deleteFileCategory,
} from '@/lib/actions/file.action';
import { CreateFileCategoryFormSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

import SubmitButton from '../../_components/submit-button';

import type { FileCategory } from '@prisma/client';

const initialState = {
  success: false,
};

export default function Category({
  fileCategories,
}: {
  fileCategories: FileCategory[];
}) {
  const [successState, formAction] = useActionState(
    createFileCategory,
    initialState,
  );

  const addForm = useForm<z.infer<typeof CreateFileCategoryFormSchema>>({
    resolver: zodResolver(CreateFileCategoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = addForm;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const [canCreate, setCanCreate] = useState(false);
  const [warnMessage, setWarnMessage] = useState('等待输入...');

  const handleDelete = async () => {
    if (selectedCategory) {
      await deleteFileCategory(selectedCategory);
      router.refresh();
      toast.success('分类删除成功', {
        description: new Date().toLocaleString(),
      });
      setSelectedCategory(() => null);
      addForm.reset();
    }
  };

  const debouncedCheckCat = useDebouncedCallback((value: string) => {
    let canCreate = false;
    let warnMessage = '等待输入...';
    if (!value) {
      setCanCreate(() => canCreate);
      setWarnMessage(warnMessage);
      return;
    }
    if (errors.name) {
      warnMessage = '';
    } else if (fileCategories.some((category) => category.name === value)) {
      warnMessage = '分类已存在';
    } else {
      canCreate = true;
      warnMessage = '分类可用';
    }

    setCanCreate(() => canCreate);
    setWarnMessage(warnMessage);
  }, 1000);

  useEffect(() => {
    if (successState.success) {
      toast.success('分类创建成功', {
        description: new Date().toLocaleString(),
      });
      requestAnimationFrame(() => {
        setCanCreate(false);
        setWarnMessage('等待输入...');
        addForm.reset();
      });
    }
  }, [successState.success, addForm]);

  return (
    <>
      <div className="relative space-y-2 p-6">
        <h4 className="pb-2 text-lg font-semibold">管理分类</h4>
        <fieldset className="rounded-lg">
          <form action={formAction}>
            <div className="flex w-full max-w-md items-center space-x-2">
              <Label
                htmlFor="name"
                className="relative mr-2 shrink-0 bg-muted p-2 py-2 leading-7"
              >
                添加分类
              </Label>
              <Input
                id="name"
                {...register('name', {
                  onChange: (e) => {
                    setWarnMessage('检查中...');
                    debouncedCheckCat(e.target.value);
                  },
                })}
                placeholder="请输入分类名称..."
                autoComplete="off"
              />

              <SubmitButton text="添加" isValid={isValid && canCreate} />
            </div>

            <p className="py-2 pl-2 text-[0.8rem] font-medium leading-6">
              {warnMessage}
            </p>

            <p className="text-[0.8rem] font-medium leading-6 text-destructive">
              {errors.name?.message}
            </p>
          </form>
        </fieldset>

        <fieldset className="rounded-lg">
          <div className="flex w-full max-w-md items-center space-x-2">
            <Label
              htmlFor="del"
              className="relative mr-2 shrink-0 bg-muted p-2 py-2 leading-7"
            >
              删除分类
            </Label>
            {fileCategories.length > 0 && (
              <Select
                onValueChange={(value) => {
                  setSelectedCategory(value);
                }}
                value={selectedCategory || ''}
              >
                <SelectTrigger id="del">
                  <SelectValue placeholder="选择一个分类" />
                </SelectTrigger>
                <SelectContent>
                  {fileCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              type="submit"
              onClick={handleDelete}
              disabled={!selectedCategory}
              className="data-dsiabled:cursor-not-allowed"
            >
              删除
            </Button>
          </div>
          <p className="px-2 py-2 text-[0.8rem] font-medium leading-6 text-muted-foreground">
            删除后，原属该分类的文件将变为无分类状态
          </p>
        </fieldset>
      </div>
      <footer className="flex min-h-14 items-center border-t border-sunlight bg-muted px-6 py-3 text-sm leading-6 text-muted-foreground dark:border-hairo">
        <div className="flex items-center">
          分类名称请使用中文或英文，不要使用特殊字符
        </div>
        <div className="ml-auto flex items-center justify-end"></div>
      </footer>
    </>
  );
}
