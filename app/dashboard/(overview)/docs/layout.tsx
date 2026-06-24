import './docs.css';

import { DocsSideNav } from '@/app/dashboard/(overview)/docs/_components/sidenav';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export const metadata = {
  title: '帮助文档',
};

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative w-full">
      <ResizablePanelGroup direction="horizontal" className="">
        <ResizablePanel
          minSize={10}
          defaultSize={15}
          className="hidden md:block"
        >
          <ScrollArea className="h-[calc(100vh-198px)]">
            <div className="container py-4">
              <DocsSideNav />
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={85} minSize={85} className="pl-7">
          <ScrollArea>
            <article className="prose prose-base prose-slate mr-7 min-w-fit pt-9 dark:prose-invert prose-a:text-primary md:px-7">
              {children}
            </article>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
