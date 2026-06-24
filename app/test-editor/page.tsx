import { cn } from '@/lib/utils';
import MyEditor from './editor/plate-editor';

export default function Page() {
  return (
    <div
      className={cn(
        'z-10 min-h-screen antialiased',
        '[&_.slate-selected]:!bg-primary/20 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-primary [&_.slate-selection-area]:bg-primary/10',
      )}
    >
      <section className="container items-center pb-8 pt-6 md:py-10">
        <div className="max-w-[1336px] rounded-lg border bg-background shadow">
          <MyEditor />
        </div>
      </section>
    </div>
  );
}
