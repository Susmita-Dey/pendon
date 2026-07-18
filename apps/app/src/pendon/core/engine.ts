import type { WorkspaceState, Listener, PendonNode } from './types';

export class PendonEngine {
  private state: WorkspaceState;
  private listeners: Set<Listener> = new Set();
  private undoStack: Record<string, PendonNode>[] = [];
  private redoStack: Record<string, PendonNode>[] = [];

  constructor() {
    this.state = {
      camera: { x: 0, y: 0, z: 1 },
      selectedNodeId: null,
      draggingNode: null,
      editingNodeId: null,
      nodes: {
        'n1': {
          id: 'n1',
          x: window.innerWidth / 2 - 160,
          y: window.innerHeight / 2 - 100,
          width: 320,
          height: 200,
          text: 'Pendon V2\nAn independent thinking environment.',
          selected: false,
          behavior: { id: 'plain', version: 1 },
          behaviorState: {},
          metadata: {},
        }
      },
    };
    this.pushHistory();
  }

  // --- History System ---
  private cloneNodes(nodes: Record<string, PendonNode>): Record<string, PendonNode> {
    return JSON.parse(JSON.stringify(nodes));
  }

  private pushHistory() {
    this.undoStack.push(this.cloneNodes(this.state.nodes));
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length > 1) { // keep initial state
      this.redoStack.push(this.undoStack.pop()!);
      this.state.nodes = this.cloneNodes(this.undoStack[this.undoStack.length - 1]);
      this.state.selectedNodeId = null;
      this.state.editingNodeId = null;
      this.notify();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.state.nodes = this.cloneNodes(nextState);
      this.state.selectedNodeId = null;
      this.state.editingNodeId = null;
      this.notify();
    }
  }

  // --- State Access ---
  getState(): WorkspaceState {
    return this.state;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  pan(dx: number, dy: number) {
    this.state.camera.x += dx;
    this.state.camera.y += dy;
    this.notify();
  }

  zoom(dz: number, px: number, py: number) {
    const { x, y, z } = this.state.camera;
    
    // Zoom limits
    const newZ = Math.min(Math.max(0.1, z - dz * 0.01), 5);
    const zoomFactor = newZ / z;
    
    // Zoom into the pointer
    const newX = px - (px - x) * zoomFactor;
    const newY = py - (py - y) * zoomFactor;

    this.state.camera = { x: newX, y: newY, z: newZ };
    this.notify();
  }

  selectNode(id: string | null) {
    this.state.selectedNodeId = id;
    for (const node of Object.values(this.state.nodes)) {
      node.selected = node.id === id;
    }
    this.notify();
  }

  startDraggingNode(id: string, type: 'move' | 'resize' = 'move') {
    this.selectNode(id);
    if (this.state.nodes[id]) {
      this.state.draggingNode = { id, type };
    }
    this.notify();
  }

  dragNode(dx: number, dy: number) {
    if (this.state.draggingNode) {
      const node = this.state.nodes[this.state.draggingNode.id];
      if (node) {
        if (this.state.draggingNode.type === 'move') {
          node.x += dx / this.state.camera.z;
          node.y += dy / this.state.camera.z;
        } else {
          node.width = Math.max(100, node.width + dx / this.state.camera.z);
          node.height = Math.max(50, node.height + dy / this.state.camera.z);
        }
        this.notify();
      }
    }
  }

  stopDragging() {
    if (this.state.draggingNode) {
      this.state.draggingNode = null;
      this.pushHistory();
      this.notify();
    }
  }

  setEditingNode(id: string | null) {
    const wasEditing = this.state.editingNodeId !== null;
    this.state.editingNodeId = id;
    if (id) {
      this.selectNode(id);
    } else if (wasEditing) {
      this.pushHistory();
    }
    this.notify();
  }

  updateNodeText(id: string, text: string) {
    if (this.state.nodes[id]) {
      this.state.nodes[id].text = text;
      this.notify();
    }
  }

  spawnNode(worldX: number, worldY: number) {
    const id = `node-${Date.now()}`;
    this.state.nodes[id] = {
      id,
      x: worldX - 160, // center on click (w: 320)
      y: worldY - 100, // center on click (h: 200)
      width: 320,
      height: 200,
      text: '',
      selected: false,
      behavior: { id: 'plain', version: 1 },
      behaviorState: {},
      metadata: {},
    };
    this.pushHistory();
    this.setEditingNode(id);
  }

  deleteSelectedNode() {
    if (this.state.selectedNodeId && !this.state.editingNodeId) {
      delete this.state.nodes[this.state.selectedNodeId];
      this.state.selectedNodeId = null;
      this.pushHistory();
      this.notify();
    }
  }
}

// Global singleton instance
export const engine = new PendonEngine();
