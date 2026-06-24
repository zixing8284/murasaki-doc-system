'use client';

import * as React from 'react';

import { type Value } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { Editor, EditorContainer } from '@/components/ui/editor';
import { TooltipProvider } from '@/components/ui/tooltip';

import { EditorKit } from './editor-kit';
import { ViewerKit } from './viewer-kit';

export type PlateEditorProps = {
  /** Initial editor value (Slate/Plate JSON). */
  value?: Value | null;
  /** Called with the latest value whenever the content changes. */
  onChange?: (value: Value) => void;
  /** Render the content without editing affordances. */
  readOnly?: boolean;
  /**
   * `default` renders the full editing experience (toolbars, drag & drop).
   * `viewer` renders a lightweight read-only surface without toolbars.
   */
  variant?: 'default' | 'viewer';
  className?: string;
  containerClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
};

export function PlateEditor({
  value,
  onChange,
  readOnly = false,
  variant = 'default',
  className,
  containerClassName,
  placeholder,
  autoFocus = false,
}: PlateEditorProps) {
  const isViewer = variant === 'viewer';

  const editor = usePlateEditor({
    plugins: isViewer ? ViewerKit : EditorKit,
    value: value && value.length > 0 ? value : undefined,
  });

  return (
    <TooltipProvider>
      <Plate
        editor={editor}
        readOnly={readOnly}
        onChange={onChange ? ({ value }) => onChange(value) : undefined}
      >
        <EditorContainer className={containerClassName}>
          <Editor
            variant="none"
            className={className}
            placeholder={placeholder}
            autoFocus={autoFocus}
            readOnly={readOnly}
          />
        </EditorContainer>
      </Plate>
    </TooltipProvider>
  );
}
