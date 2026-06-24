'use client';

import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  HEADER_NAV_HEIGHT,
  HEADER_TOP_HEIGHT,
  manageNavLinkGroups,
} from '@/config/site';
import { cn } from '@/lib/utils';
import { PinLeftIcon } from '@radix-ui/react-icons';

import type { ImperativePanelHandle } from 'react-resizable-panels';
import { Separator } from '@/components/ui/separator';
import { Nav } from './_components/nav';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { width = 0 } = useWindowSize();
  const ref = useRef<ImperativePanelHandle>(null);

  const toggleCollapsed = () => {
    const panel = ref.current;
    if (panel) {
      panel.isCollapsed() ? panel.expand() : panel.collapse();
      setCollapsed(!collapsed);
    }
  };

  useEffect(() => {
    if (width < 768) {
      ref.current?.collapse();
      requestAnimationFrame(() => {
        setCollapsed(true);
      });
    }
  }, [width]);

  return (
    <>
      <div className="relative flex h-full flex-1 flex-col overflow-hidden pl-2 pr-3 md:pl-4 md:pr-6 lg:pl-8">
        <TooltipProvider delayDuration={0}>
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full flex-1 items-stretch"
          >
            <ResizablePanel
              id="left-panel"
              ref={ref}
              defaultSize={10}
              minSize={8}
              maxSize={10}
              collapsedSize={1}
              collapsible
              style={{ overflow: 'initial' }}
              className={cn('relative', collapsed && 'min-w-12.5')}
            >
              <div className="pt-4">
                <Nav
                  isCollapsed={collapsed}
                  links={manageNavLinkGroups['first']}
                />
                <Separator />
                <Nav
                  isCollapsed={collapsed}
                  links={manageNavLinkGroups['second']}
                />
              </div>
              <div className="mt-auto flex justify-end px-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="hidden h-8 w-8 rounded-md md:inline-flex"
                  onClick={toggleCollapsed}
                >
                  <PinLeftIcon
                    className={`h-3 w-3 ${collapsed ? 'rotate-180' : ''}`}
                  />
                </Button>
              </div>
            </ResizablePanel>

            <ResizableHandle
              disabled
              className="pointer-events-none select-none"
            />

            <ResizablePanel defaultSize={90}>
              <div className="flex h-full items-center justify-center p-3 md:p-6">
                <main id="content" className="h-full w-full min-w-0 pt-4 md:pt-0">
                  {children}
                </main>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </div>
    </>
  );
}
