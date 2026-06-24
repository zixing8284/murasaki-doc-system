import '@/app/globals.css';

import { GeistMono } from 'geist/font/mono';
import HolyLoader from 'holy-loader';
import { Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';

import { StyleProvider } from '@/app/ui/style-provider';
import { ThemeProvider } from '@/app/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

/**
 * Fuck you next.js Default cache
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from 'next';
// 思源宋体
const NotoSerifSC = Noto_Serif_SC({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif-sc',
});

// 思源黑体
const NotoSansSC = Noto_Sans_SC({
  weight: '700',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
});

export const metadata: Metadata = {
  title: {
    default: 'MURASAKI 文档管理',
    template: '%s | MURASAKI 文档管理',
  },
  description: 'MURASAKI Docs，一个简单的文档管理系统',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        GeistMono.variable,
        NotoSerifSC.variable,
        NotoSansSC.variable,
        GeistMono.className,
      )}
    >
      <HolyLoader
        color="hsl(148.82 100% 24.9%)"
        height="2px"
        speed={250}
        easing="linear"
        showSpinner={false}
      />
      <body id="style-container">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StyleProvider defaultStyle="zinc" storageKey="ui-style">
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                actionButtonStyle: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                },
                cancelButtonStyle: {
                  backgroundColor: 'hsl(var(--destructive))',
                  color: 'hsl(var(--destructive-foreground))',
                },
              }}
            />
          </StyleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
