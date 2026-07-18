import { type TLBaseShape } from 'tldraw';

export type BehaviorDescriptor = {
  id: string;
  version: number;
};

export type PendonShapeProps = {
  text: string;
  behavior: BehaviorDescriptor;
  behaviorState: unknown;
  w: number;
  h: number;
};

export type PendonShape = TLBaseShape<'pendon', PendonShapeProps>;
