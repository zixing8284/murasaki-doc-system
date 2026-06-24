'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { toast } from 'sonner';

import { Icons } from '@/app/ui/custom-icons';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveFiles } from '@/lib/actions/file.action';
import { formatBytes } from '@/lib/utils';

import SubmitButton from '../../_components/submit-button';

import type { FileCategory } from '@prisma/client';
const initialState = {
  errors: {},
  message: '',
};

export default function UploadForm({
  fileCategories,
}: {
  fileCategories: FileCategory[];
}) {
  const [state, formAction] = useActionState(saveFiles, initialState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [key, setKey] = useState(+new Date());

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      setSelectedFiles((prev) => Array.from(files));
    }
  }

  const router = useRouter();

  useEffect(() => {
    if (state?.errors?.files) {
      toast(state.errors.files.map((error: string) => error).join(', '), {
        description: new Date().toLocaleString(),
      });
      requestAnimationFrame(() => {
        setKey(+new Date());
        setSelectedFiles([]);
      });
    } else if (state?.status === 'success') {
      toast.success('文件上传成功', {
        description: new Date().toLocaleString(),
      });
      router.refresh();
      requestAnimationFrame(() => {
        setKey(+new Date());
        setSelectedFiles([]);
      });
    }
  }, [state, router]);

  return (
    <form action={formAction} id="fileform" key={key}>
      <div className="relative p-6">
        <h4 className="text-lg font-semibold">上传文件</h4>
        <div className="space-y-10">
          <div className="col-span-full">
            <div className="my-3 flex justify-start rounded-lg">
              <div className="flex flex-col items-center space-y-4 text-sm leading-6">
                <div className="flex w-full max-w-md items-center space-x-2">
                  <Label
                    htmlFor="select-cat"
                    className="relative mr-2 shrink-0 bg-muted p-2 py-2 leading-7"
                  >
                    选择分类
                  </Label>
                  {fileCategories.length > 0 ? (
                    <Select name="cat" required>
                      <SelectTrigger id="select-cat">
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
                  ) : (
                    <p className="text-sm leading-5 text-muted-foreground">
                      请先创建一个分类
                    </p>
                  )}
                </div>

                <div className="flex items-center text-sm leading-6">
                  <label
                    htmlFor="file-upload"
                    className="relative mr-2 cursor-pointer bg-muted p-2 leading-7 text-primary hover:text-muted-foreground"
                  >
                    <span>选择文件</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      aria-describedby="upload-error"
                      onChange={handleFileChange}
                      className="sr-only"
                      max={10}
                      required
                    />
                  </label>
                  <p className="text-xs leading-5 text-muted-foreground">
                    最多同时上传10个文件，单个文件不要超过10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="upload-error" aria-live="polite" aria-atomic="true">
          {state?.message ? (
            <p className="mt-2 text-sm text-red-500">{state.message}</p>
          ) : null}
        </div>
        {selectedFiles.length > 0 ? (
          <ScrollArea className="h-fit w-full border border-dotted p-4">
            <div className="max-h-48 space-y-2">
              {selectedFiles.map((file) => (
                <FileCard key={`${file.name}-${file.size}`} file={file} />
              ))}
            </div>
          </ScrollArea>
        ) : null}
      </div>

      <footer className="flex min-h-14 items-center border-t border-sunlight bg-muted px-6 py-3 text-sm leading-6 text-muted-foreground dark:border-hairo">
        <div className="flex items-center">{''}</div>
        <div className="ml-auto flex items-center justify-end">
          <SubmitButton text="上传" />
        </div>
      </footer>
    </form>
  );
}

function isFileWithPreview(file: File): file is File {
  if (!file.type.startsWith('image/')) {
    return false;
  }
  return true;
}

function FileCard({ file }: { file: File }) {
  return (
    <div className="flex-center relative space-x-4">
      <div className="flex flex-1 items-end space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            src={URL.createObjectURL(file)}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="object-cove aspect-square shrink-0 rounded-[4px] border border-dashed"
          />
        ) : (
          <Icons.docUp className="h-12 w-12 rounded-[4px] border border-dashed font-thin text-muted-foreground/50" />
        )}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm font-thin text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
