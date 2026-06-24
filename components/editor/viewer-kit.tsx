'use client';

import { type Value } from 'platejs';
import { type TPlateEditor } from 'platejs/react';

import { AlignKit } from './plugins/align-kit';
import { BasicBlocksKit } from './plugins/basic-blocks-kit';
import { BasicMarksKit } from './plugins/basic-marks-kit';
import { CodeBlockKit } from './plugins/code-block-kit';
import { ColumnKit } from './plugins/column-kit';
import { FontKit } from './plugins/font-kit';
import { LineHeightKit } from './plugins/line-height-kit';
import { LinkKit } from './plugins/link-kit';
import { ListKit } from './plugins/list-kit';
import { MediaKit } from './plugins/media-kit';
import { TableKit } from './plugins/table-kit';

/**
 * Lightweight read-only plugin set used to render stored editor content
 * (e.g. timeline previews) without any toolbar / editing affordances.
 */
export const ViewerKit = [
  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...MediaKit,
  ...ColumnKit,
  ...LinkKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,
];

export type ViewerEditor = TPlateEditor<Value, (typeof ViewerKit)[number]>;
