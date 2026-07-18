import { type TLBaseShape } from 'tldraw';
import type { BehaviorDescriptor } from '../../core/node/types';

export type PendonShapeProps = {
  text: string;
  behavior: BehaviorDescriptor;
  behaviorState: unknown;
  w: number;
  h: number;
};

export type PendonShape = TLBaseShape<'pendon', PendonShapeProps>;
