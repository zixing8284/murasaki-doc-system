import { AlertCircle, Archive, Send, Users2 } from 'lucide-react';

export const HEADER_TOP_HEIGHT = 12;
export const HEADER_NAV_HEIGHT = 12;
export const siteConfig = {
  name: 'MURASAKI 文档管理',
  url:
    process.env.NODE_ENV === 'production'
      ? 'http://localhost:3001'
      : 'http://localhost:3000',
  description: 'MURASAKI Docs — 一个简单的文档管理系统',
  links: {
    home: '#',
  },
};

export type SiteConfig = typeof siteConfig;

export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const mainNav = [
  {
    href: '/dashboard/docs',
    label: '帮助文档',
    // img: '/images/docs.svg',
  },
  {
    href: '/dashboard/filecenter',
    label: '文件中心',
  },
  {
    href: '/dashboard/manage',
    label: '日常管理',
  },
  // {
  //   href: '/dashboard/setting',
  //   label: '个人设置',
  // },
  {
    href: '/dashboard/admin',
    label: '系统管理',
    superAdminOnly: true,
  },
];

// TODO: items: name->label, slug->href
export const filecenterSideNavs: { name: string; items: Item[] }[] = [
  {
    name: '分类',
    items: [
      {
        name: '技术文档',
        slug: 'tech',
        description: '技术文档',
      },
      {
        name: '产品手册',
        slug: 'manual',
        description: '产品手册',
      },
      {
        name: '会议纪要',
        slug: 'minutes',
        description: '会议纪要',
      },
    ],
  },
];

export const adminSideNavs = [
  {
    label: '综合管理',
    href: '/dashboard/admin',
  },
  {
    label: '文件管理',
    href: '/dashboard/admin/files',
  },
  {
    label: '账户管理',
    href: '/dashboard/admin/account',
  },
  {
    label: '模板管理',
    href: '/dashboard/admin/templates',
  },
];

export const docsSideNavs = [
  {
    label: '介绍',
    href: '/dashboard/docs',
  },
  {
    label: '更新日志',
    href: '/dashboard/docs/changelog',
  },
];

export type ManageNavLink = {
  title: string;
  href: string;
  label?: string;
  icon: any;
  variant: 'default' | 'ghost';
  disabled?: boolean;
};

export const manageNavLinkGroups: Record<string, ManageNavLink[]> = {
  first: [
    {
      title: '开始',
      href: '/dashboard/manage',
      label: '',
      icon: Send,
      variant: 'ghost',
    },
    {
      title: '公告',
      label: '',
      href: '/dashboard/manage/org_public',
      icon: AlertCircle,
      variant: 'ghost',
    },
  ],
  second: [
    {
      title: '目录',
      href: '/dashboard/manage/catalog',
      label: '开发中',
      icon: Archive,
      variant: 'ghost',
    },
    {
      title: '成员',
      href: '/dashboard/manage/members',
      label: '未开放',
      icon: Users2,
      variant: 'ghost',
      disabled: true,
    },
  ],
};
