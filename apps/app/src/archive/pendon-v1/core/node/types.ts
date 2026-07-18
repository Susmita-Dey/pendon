export type BehaviorDescriptor = {
  id: string;
  version: number;
};

export type PendonNode = {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  text: string;
  behavior: BehaviorDescriptor;
  behaviorState: unknown;
  metadata: Record<string, unknown>;
};
