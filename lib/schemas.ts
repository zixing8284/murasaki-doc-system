import { z } from 'zod';

/**
 * @note
 * function name suffix is `FormSchema` to indicate that it's a form schema.
 * otherwise, it's used in server-side validation.
 */

export const AnnouncementSchema = z.object({
  content: z.string().default(
    JSON.stringify([
      {
        children: [
          {
            text: '',
          },
        ],
        type: 'p',
      },
    ]),
  ),
});

export const DeletePostCategoryFormSchema = z.object({
  name: z
    .string({
      error: '请选择一个目录',
    })
    .min(1, {
      message: '请选择一个目录',
    }),
});

export const CreatePostCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '目录名称必须至少为1个字符，最大不超过10个字符。',
    })
    .max(10, {
      message: '目录名称必须至少为1个字符，最大不超过10个字符。',
    })
    .trim()
    .refine((value) => /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value), {
      message: '目录名称必须为中文、英文或数字字符。',
    }),
});

export const CreateFileCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '分类名称必须至少为1个字符，最大不超过10个字符。',
    })
    .max(10, {
      message: '分类名称必须至少为1个字符，最大不超过10个字符。',
    })
    .trim()
    .refine((value) => /^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value), {
      message: '分类名称必须为中文、英文或数字字符。',
    }),
});

export const SigninFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: '用户名过短',
    })
    .trim(),
  password: z
    .string()
    .min(6, {
      message: '密码过短',
    })
    .trim(),
});

export const UpdateSuperAdminAccountFormSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: '账号名称必须至少为3个字符，最大不超过30个字符。',
      })
      .max(30, {
        message: '账号名称必须至少为3个字符，最大不超过30个字符。',
      })
      .trim(),
    password: z
      .string()
      .min(1, {
        message: '密码不能为空。',
      })
      .min(6, {
        message: '密码必须至少为6个字符，最大不超过18个字符。',
      })
      .max(18, {
        message: '密码必须至少为6个字符，最大不超过18个字符。',
      })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密码不匹配。',
    path: ['confirmPassword'],
  });

export const CreateDepartmentFormSchema = z.object({
  departname: z
    .string()
    .min(3, {
      message: '组织名称必须至少为3个字符，最大不超过30个字符。',
    })
    .trim()
    .refine((value) => /^[\u4e00-\u9fa5]+$/.test(value), {
      message: '组织名称必须为中文字符。',
    }),
  username: z
    .string()
    .min(3, {
      message: '账号名称必须至少为3个字符，最大不超过30个字符。',
    })
    .trim(),
  password: z
    .string()
    .min(6, {
      message: '密码必须至少为6个字符，最大不超过18个字符。',
    })
    .trim(),
});

const defaultContent = JSON.stringify([
  {
    children: [
      {
        text: '',
      },
    ],
    type: 'p',
  },
]);

export const PostSchema = z.object({
  title: z
    .string()
    .max(30, {
      message: '标题最大不超过30个字符。',
    })
    .trim()
    .default('无标题记录'),
  content: z.string().nullable().transform((v) => v ?? defaultContent),
  published: z.boolean(),
});

export const PostFromTemplateFormSchema = z.object({
  title: z
    .string()
    .max(30, {
      message: '标题最大不超过30个字符。',
    })
    .trim()
    .default('无标题记录'),
  content: z.string().default(
    JSON.stringify([
      {
        children: [
          {
            text: '',
          },
        ],
        type: 'p',
      },
    ]),
  ),
  templateId: z.string({
    error: '请选择一个模板',
  }),
  categoryId: z.string({
    error: '请选择一个目录',
  }),
  published: z.boolean(),
});

export const TemplateSchema = z.object({
  name: z
    .string()
    .max(30, {
      message: '模板名称最大不超过30个字符。',
    })
    .trim()
    .default('未命名模板'),
  description: z
    .string()
    .max(100, {
      message: '模板描述最大不超过100个字符。',
    })
    .trim()
    .default('无描述'),
  content: z.string().default(
    JSON.stringify([
      {
        children: [
          {
            text: '',
          },
        ],
        type: 'p',
      },
    ]),
  ),
  published: z.boolean(),
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_FILE_COUNT = 10;

const THREAT_FILE_TYPES = [
  'application/octet-stream', // 二进制文件
  'application/javascript', // JavaScript 文件
  'application/x-sh', // Shell 脚本
  'application/x-csh', // C Shell 脚本
  'application/x-msdownload', // Windows 可执行文件
  'application/x-msdos-program', // MS-DOS 程序
  'application/x-perl', // Perl 脚本
  'application/x-python', // Python 脚本
  'application/java-archive', // Java 归档文件
  'application/sql', // SQL 文件
  'application/xml', // XML 文件
];

function checkFileType(file: File) {
  if (!file?.name) return false;
  const fileType = file.type.split('/')[1];
  if (THREAT_FILE_TYPES.includes(file.type)) return false;
  return true;
}

export const uploadFileFormSchema = z.object({
  files: z
    // FileList is not a array, so we need to convert it to array
    // z.custom<FileList>()
    .array(z.custom<File>()) // or z.array(z.(File))
    .refine(
      (files) => {
        return files.every((file) => file instanceof File);
      },
      {
        message: '不是有效的文件',
      },
    )
    .refine((files) => Array.from(files).every((file) => checkFileType(file)), {
      message: '不允许的文件类型',
    })
    .refine((files) => {
      return (
        files[0].size > 0 &&
        Array.from(files).length >= 1 &&
        Array.from(files).some((file) => file.size > 0)
      );
    }, '请选择至少一个文件，保证没有空文件')
    .refine((files) => files?.length <= MAX_FILE_COUNT, {
      message: `最多上传${MAX_FILE_COUNT}个文件`,
    })
    .refine(
      (files) =>
        Array.from(files).every((file) => !file || file.size <= MAX_FILE_SIZE),
      {
        message: '单个文件大小不能超过10MB',
      },
    ),
  cat: z.string().min(1),
});
