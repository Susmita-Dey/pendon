import type { WorkspaceState, Listener } from './types';

export class PendonEngine {
  private state: WorkspaceState;
  private listeners: Set<Listener> = new Set();

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
  }

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
    this.state.draggingNode = null;
    this.notify();
  }

  setEditingNode(id: string | null) {
    this.state.editingNodeId = id;
    if (id) this.selectNode(id);
    this.notify();
  }

  updateNodeText(id: string, text: string) {
    if (this.state.nodes[id]) {
      this.state.nodes[id].text = text;
      this.notify();
    }
  }
}

// Global singleton instance
export const engine = new PendonEngine();
