import type { PendonNode } from '../core/node/types';

export interface CanvasRuntime {
  getNode(id: string): PendonNode | undefined;
  updateNode(id: string, partial: Partial<PendonNode>): void;
  getSelectedNodes(): PendonNode[];
}
