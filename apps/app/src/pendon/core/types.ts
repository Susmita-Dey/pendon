export interface Camera {
  x: number;
  y: number;
  z: number;
}

export interface BehaviorDescriptor {
  id: 'plain' | 'checklist';
  version: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
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
  behaviorState?: unknown;
  styleId: string;
  toneId: string;
  objectTypeId: string;
  metadata: Record<string, unknown>;
  zIndex: number;
  layer: 'frame' | 'node' | 'overlay';
  createdAt?: number;
}

export interface AlignmentGuide {
  id: string;
  type: 'horizontal' | 'vertical';
  x: number;
  y: number;
  length: number;
}

export interface DistanceIndicator {
  id: string;
  type: 'horizontal' | 'vertical';
  x: number;
  y: number;
  distance: number;
}

export interface WorkspaceState {
  camera: Camera;
  nodes: Record<string, PendonNode>;
  selectedNodeIds: string[];
  draggingNode: { id: string, type: 'move' | 'resize' } | null;
  editingNodeId: string | null;
  selectionBox: { startX: number, startY: number, currentX: number, currentY: number } | null;
  clipboardNodes: PendonNode[];
  alignmentGuides: AlignmentGuide[];
  distanceIndicators: DistanceIndicator[];
  layoutSuggestion: { type: 'align-h' | 'align-v', targetIds: string[], x: number, y: number } | null;
  zenMode: boolean;
  activeTool: 'pointer' | 'express' | 'frame' | 'connect';
  activeExpression: { x: number; y: number } | null;
  activeStroke: { id: string; points: {x: number, y: number}[] } | null;
}

export type Listener = () => void;
