export interface Camera {
  x: number;
  y: number;
  z: number;
}

export interface BehaviorDescriptor {
  id: string;
  version: number;
}

export interface PendonNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  selected: boolean;
  behavior: BehaviorDescriptor;
  behaviorState: unknown;
  styleId: string;
  toneId: string;
  objectTypeId: string;
  metadata: Record<string, unknown>;
}

export interface WorkspaceState {
  camera: Camera;
  nodes: Record<string, PendonNode>;
  selectedNodeId: string | null;
  draggingNode: { id: string, type: 'move' | 'resize' } | null;
  editingNodeId: string | null;
}

export type Listener = () => void;
