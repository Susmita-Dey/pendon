import type { WorkspaceState, Listener, PendonNode } from './types';
import { calculateSnaps, detectNearMisses } from './spatial';

export class PendonEngine {
  private state: WorkspaceState;
  private listeners: Set<Listener> = new Set();
  private undoStack: Record<string, PendonNode>[] = [];
  private redoStack: Record<string, PendonNode>[] = [];

  constructor() {
    this.state = {
      camera: { x: 0, y: 0, z: 1 },
      selectedNodeIds: [],
      draggingNode: null,
      editingNodeId: null,
      selectionBox: null,
      clipboardNodes: [],
      alignmentGuides: [],
      distanceIndicators: [],
      layoutSuggestion: null,
      zenMode: false,
      activeTool: 'pointer',
      activeExpression: null,
      activeStroke: null,
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
          styleId: 'paper',
          toneId: 'neutral',
          objectTypeId: 'note',
          metadata: {},
          zIndex: 0,
          layer: 'node',
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
      this.state.selectedNodeIds = [];
      this.state.editingNodeId = null;
      this.state.alignmentGuides = [];
      this.state.layoutSuggestion = null;
      this.notify();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop()!;
      this.undoStack.push(nextState);
      this.state.nodes = this.cloneNodes(nextState);
      this.state.selectedNodeIds = [];
      this.state.editingNodeId = null;
      this.state.alignmentGuides = [];
      this.state.layoutSuggestion = null;
      this.notify();
    }
  }

  toggleZenMode() {
    this.state.zenMode = !this.state.zenMode;
    this.notify();
  }

  centerCamera() {
    // Basic centering logic to return to origin, could be improved to frame bounds later
    this.state.camera.x = window.innerWidth / 2;
    this.state.camera.y = window.innerHeight / 2;
    this.notify();
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

  selectNode(id: string | null, additive: boolean = false) {
    if (id === null) {
      this.state.selectedNodeIds = [];
    } else {
      if (additive) {
        if (this.state.selectedNodeIds.includes(id)) {
          this.state.selectedNodeIds = this.state.selectedNodeIds.filter(nId => nId !== id);
        } else {
          this.state.selectedNodeIds.push(id);
        }
      } else {
        if (!this.state.selectedNodeIds.includes(id)) {
          this.state.selectedNodeIds = [id];
        }
      }
    }
    
    for (const node of Object.values(this.state.nodes)) {
      node.selected = this.state.selectedNodeIds.includes(node.id);
    }
    this.state.layoutSuggestion = null;
    this.notify();
  }

  startDraggingNode(id: string, type: 'move' | 'resize' = 'move', additive: boolean = false) {
    if (!this.state.selectedNodeIds.includes(id) && !additive) {
      this.selectNode(id, false);
    } else if (additive && !this.state.selectedNodeIds.includes(id)) {
      this.selectNode(id, true);
    }
    
    // Frame containment check
    const node = this.state.nodes[id];
    if (node && node.objectTypeId === 'frame') {
       // Find all nodes inside this frame
       for (const other of Object.values(this.state.nodes)) {
          if (other.id !== id && other.layer !== 'frame') {
             const cx = other.x + other.width / 2;
             const cy = other.y + other.height / 2;
             if (cx > node.x && cx < node.x + node.width && cy > node.y && cy < node.y + node.height) {
                if (!this.state.selectedNodeIds.includes(other.id)) {
                   this.state.selectedNodeIds.push(other.id);
                   other.selected = true;
                }
             }
          }
       }
    }
    
    if (this.state.nodes[id]) {
      this.state.draggingNode = { id, type };
    }
    this.state.layoutSuggestion = null;
    this.notify();
  }

  dragNode(dx: number, dy: number) {
    if (this.state.draggingNode) {
      const zoom = this.state.camera.z;
      const moveX = dx / zoom;
      const moveY = dy / zoom;
      
      if (this.state.draggingNode.type === 'move') {
        const draggedNodes = this.state.selectedNodeIds.map(id => this.state.nodes[id]);
        
        // Initial move
        for (const n of draggedNodes) {
           if (n) {
             n.x += moveX;
             n.y += moveY;
           }
        }

        // Snapping logic
        const snap = calculateSnaps(draggedNodes, this.state.nodes);
        if (snap.dx !== 0 || snap.dy !== 0) {
           for (const n of draggedNodes) {
             if (n) {
               n.x += snap.dx;
               n.y += snap.dy;
             }
           }
        }
        
        this.state.alignmentGuides = snap.guides;
        this.state.distanceIndicators = snap.indicators;

      } else {
        const id = this.state.draggingNode.id;
        const node = this.state.nodes[id];
        if (node) {
          node.width = Math.max(100, node.width + moveX);
          node.height = Math.max(50, node.height + moveY);
        }
      }
      this.notify();
    }
  }

  stopDragging() {
    if (this.state.draggingNode) {
      if (this.state.draggingNode.type === 'move') {
        const draggedNodes = this.state.selectedNodeIds.map(id => this.state.nodes[id]);
        this.state.layoutSuggestion = detectNearMisses(draggedNodes, this.state.nodes);
      }
      this.state.draggingNode = null;
      this.state.alignmentGuides = [];
      this.state.distanceIndicators = [];
      this.pushHistory();
      this.notify();
    }
  }

  distributeSelectedNodes(axis: 'horizontal' | 'vertical') {
     if (this.state.selectedNodeIds.length < 3) return;
     
     const nodes = this.state.selectedNodeIds.map(id => this.state.nodes[id]);
     if (axis === 'horizontal') {
        nodes.sort((a, b) => a.x - b.x);
        const minX = nodes[0].x;
        const maxX = nodes[nodes.length - 1].x + nodes[nodes.length - 1].width;
        let totalWidths = 0;
        for (const n of nodes) totalWidths += n.width;
        
        const spacing = (maxX - minX - totalWidths) / (nodes.length - 1);
        let currX = minX;
        for (const n of nodes) {
           n.x = currX;
           currX += n.width + spacing;
        }
     } else {
        nodes.sort((a, b) => a.y - b.y);
        const minY = nodes[0].y;
        const maxY = nodes[nodes.length - 1].y + nodes[nodes.length - 1].height;
        let totalHeights = 0;
        for (const n of nodes) totalHeights += n.height;
        
        const spacing = (maxY - minY - totalHeights) / (nodes.length - 1);
        let currY = minY;
        for (const n of nodes) {
           n.y = currY;
           currY += n.height + spacing;
        }
     }
     
     this.pushHistory();
     this.notify();
  }

  applyLayoutSuggestion() {
      if (this.state.layoutSuggestion) {
          const { type, targetIds, x, y } = this.state.layoutSuggestion;
          for (const id of targetIds) {
              const node = this.state.nodes[id];
              if (node) {
                  if (type === 'align-h') {
                      node.y = y - node.height / 2;
                  } else {
                      node.x = x - node.width / 2;
                  }
              }
          }
          this.state.layoutSuggestion = null;
          this.pushHistory();
          this.notify();
      }
  }

  setEditingNode(id: string | null) {
    const wasEditing = this.state.editingNodeId !== null;
    this.state.editingNodeId = id;
    if (id) {
      this.selectNode(id, false);
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

  upgradeNodeBehavior(id: string, behaviorId: 'plain' | 'checklist', initialState?: unknown, newText?: string) {
    if (this.state.nodes[id]) {
      this.state.nodes[id].behavior = { id: behaviorId, version: 1 };
      if (initialState !== undefined) {
         this.state.nodes[id].behaviorState = initialState;
      }
      if (newText !== undefined) {
         this.state.nodes[id].text = newText;
      }
      
      // Let's also adjust the size nicely if it's becoming a checklist
      if (behaviorId === 'checklist') {
          this.state.nodes[id].width = Math.max(this.state.nodes[id].width, 360);
          this.state.nodes[id].height = Math.max(this.state.nodes[id].height, 240);
      }
      
      this.pushHistory();
      this.notify();
    }
  }

  updateBehaviorState(id: string, newState: unknown) {
     if (this.state.nodes[id]) {
        this.state.nodes[id].behaviorState = newState;
        this.notify();
     }
  }

  commitBehaviorStateHistory() {
     this.pushHistory();
  }

  updateSelectedNodesStyle(styleId: string) {
    for (const id of this.state.selectedNodeIds) {
      if (this.state.nodes[id]) {
        this.state.nodes[id].styleId = styleId;
      }
    }
    if (this.state.selectedNodeIds.length > 0) {
      this.pushHistory();
      this.notify();
    }
  }

  updateSelectedNodesTone(toneId: string) {
    for (const id of this.state.selectedNodeIds) {
      if (this.state.nodes[id]) {
        this.state.nodes[id].toneId = toneId;
      }
    }
    if (this.state.selectedNodeIds.length > 0) {
      this.pushHistory();
      this.notify();
    }
  }

  updateSelectedNodesObjectType(objectTypeId: string) {
    for (const id of this.state.selectedNodeIds) {
      if (this.state.nodes[id]) {
        this.state.nodes[id].objectTypeId = objectTypeId;
        if (objectTypeId === 'frame') {
            this.state.nodes[id].layer = 'frame';
        }
      }
    }
    if (this.state.selectedNodeIds.length > 0) {
      this.pushHistory();
      this.notify();
    }
  }
  
  getMaxZIndex(layer: 'frame' | 'node' | 'overlay' = 'node'): number {
    let max = 0;
    for (const node of Object.values(this.state.nodes)) {
      if (node.layer === layer && node.zIndex > max) max = node.zIndex;
    }
    return max;
  }

  spawnNode(x: number, y: number) {
    const id = `node-${Date.now()}`;
    const highestZ = Math.max(0, ...Object.values(this.state.nodes).map(n => n.zIndex));
    
    this.state.nodes[id] = {
      id,
      x: x - 150, // Center relative to spawn point
      y: y - 50,
      width: 300,
      height: 100,
      text: '',
      objectTypeId: 'note',
      styleId: 'paper',
      toneId: 'neutral',
      selected: true,
      layer: 'node',
      zIndex: highestZ + 1,
      behavior: { id: 'plain', version: 1 },
      createdAt: Date.now(),
    };
    this.state.selectedNodeIds = [id];
    this.state.editingNodeId = id;
    this.pushHistory();
    this.notify();
    return id;
  }

  // --- Expressions ---
  beginExpression(x: number, y: number) {
    this.state.activeExpression = { x, y };
    this.state.editingNodeId = null;
    this.state.selectedNodeIds = [];
    this.notify();
  }

  commitExpression(text: string, x: number, y: number) {
    this.state.activeExpression = null;
    if (text.trim() === '') {
      this.notify();
      return null;
    }
    const id = `node-${Date.now()}`;
    const highestZ = Math.max(0, ...Object.values(this.state.nodes).map(n => n.zIndex));
    
    this.state.nodes[id] = {
      id,
      x: x, // Not centered, exact caret start position
      y: y,
      width: 300,
      height: 100,
      text: text,
      objectTypeId: 'note',
      styleId: 'paper',
      toneId: 'neutral',
      selected: true,
      layer: 'node',
      zIndex: highestZ + 1,
      behavior: { id: 'plain', version: 1 },
      createdAt: Date.now(), // Marks it for emerging animation
    };
    this.state.selectedNodeIds = [id];
    this.state.editingNodeId = id;
    this.pushHistory();
    this.notify();
    return id;
  }

  cancelExpression() {
    this.state.activeExpression = null;
    this.notify();
  }

  setActiveTool(tool: 'pointer' | 'express' | 'frame' | 'connect') {
    this.state.activeTool = tool;
    this.notify();
  }

  flyToNode(id: string) {
    const node = this.state.nodes[id];
    if (node) {
       this.state.camera.x = window.innerWidth / 2 - (node.x + node.width / 2) * this.state.camera.z;
       this.state.camera.y = window.innerHeight / 2 - (node.y + node.height / 2) * this.state.camera.z;
       this.state.selectedNodeIds = [id];
       this.notify();
    }
  }

  // --- Strokes ---
  beginStroke(x: number, y: number) {
    this.state.activeStroke = { id: `stroke-${Date.now()}`, points: [{x, y}] };
    this.notify();
  }

  updateStroke(x: number, y: number) {
    if (this.state.activeStroke) {
      this.state.activeStroke.points.push({x, y});
      this.notify();
    }
  }

  endStroke() {
    const stroke = this.state.activeStroke;
    this.state.activeStroke = null;
    this.notify();
    return stroke;
  }

  deleteSelectedNodes() {
    if (this.state.selectedNodeIds.length > 0 && !this.state.editingNodeId) {
      for (const id of this.state.selectedNodeIds) {
        delete this.state.nodes[id];
      }
      this.state.selectedNodeIds = [];
      this.pushHistory();
      this.notify();
    }
  }
  
  duplicateSelectedNodes() {
    if (this.state.selectedNodeIds.length > 0 && !this.state.editingNodeId) {
      const newSelectedIds: string[] = [];
      const offset = 32; 
      
      for (const id of this.state.selectedNodeIds) {
        const node = this.state.nodes[id];
        if (node) {
          const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newNode = JSON.parse(JSON.stringify(node)) as PendonNode;
          newNode.id = newId;
          newNode.x += offset;
          newNode.y += offset;
          newNode.selected = true;
          newNode.zIndex = this.getMaxZIndex(newNode.layer) + 1;
          
          this.state.nodes[newId] = newNode;
          newSelectedIds.push(newId);
          this.state.nodes[id].selected = false;
        }
      }
      this.state.selectedNodeIds = newSelectedIds;
      this.pushHistory();
      this.notify();
    }
  }

  copySelectedNodes() {
    if (this.state.selectedNodeIds.length > 0 && !this.state.editingNodeId) {
      this.state.clipboardNodes = this.state.selectedNodeIds
        .map(id => this.state.nodes[id])
        .filter(n => n !== undefined)
        .map(n => JSON.parse(JSON.stringify(n)));
    }
  }

  cutSelectedNodes() {
    if (this.state.selectedNodeIds.length > 0 && !this.state.editingNodeId) {
      this.copySelectedNodes();
      this.deleteSelectedNodes();
    }
  }

  pasteNodes() {
    if (this.state.clipboardNodes.length > 0 && !this.state.editingNodeId) {
      const newSelectedIds: string[] = [];
      const offset = 32;
      
      for (const id of this.state.selectedNodeIds) {
        if (this.state.nodes[id]) {
          this.state.nodes[id].selected = false;
        }
      }

      for (const node of this.state.clipboardNodes) {
        const newId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNode = JSON.parse(JSON.stringify(node)) as PendonNode;
        newNode.id = newId;
        newNode.x += offset;
        newNode.y += offset;
        newNode.selected = true;
        newNode.zIndex = this.getMaxZIndex(newNode.layer) + 1;
        
        this.state.nodes[newId] = newNode;
        newSelectedIds.push(newId);
      }
      
      this.state.clipboardNodes = this.state.clipboardNodes.map(n => ({...n, x: n.x + offset, y: n.y + offset}));
      
      this.state.selectedNodeIds = newSelectedIds;
      this.pushHistory();
      this.notify();
    }
  }

  nudgeSelectedNodes(dx: number, dy: number) {
    if (this.state.selectedNodeIds.length > 0 && !this.state.editingNodeId) {
      for (const id of this.state.selectedNodeIds) {
        if (this.state.nodes[id]) {
          this.state.nodes[id].x += dx;
          this.state.nodes[id].y += dy;
        }
      }
      this.pushHistory();
      this.notify();
    }
  }

  startSelectionBox(x: number, y: number) {
    this.state.selectionBox = { startX: x, startY: y, currentX: x, currentY: y };
    if (!this.state.editingNodeId) {
        this.selectNode(null);
    }
    this.notify();
  }

  updateSelectionBox(x: number, y: number) {
    if (this.state.selectionBox) {
      this.state.selectionBox.currentX = x;
      this.state.selectionBox.currentY = y;
      
      const { startX, startY, currentX, currentY } = this.state.selectionBox;
      const minX = Math.min(startX, currentX);
      const maxX = Math.max(startX, currentX);
      const minY = Math.min(startY, currentY);
      const maxY = Math.max(startY, currentY);

      const newSelection: string[] = [];
      for (const node of Object.values(this.state.nodes)) {
        if (
          node.x < maxX &&
          node.x + node.width > minX &&
          node.y < maxY &&
          node.y + node.height > minY
        ) {
          newSelection.push(node.id);
        }
      }
      
      this.state.selectedNodeIds = newSelection;
      for (const node of Object.values(this.state.nodes)) {
        node.selected = newSelection.includes(node.id);
      }
      
      this.notify();
    }
  }

  endSelectionBox() {
    this.state.selectionBox = null;
    this.notify();
  }
}

export const engine = new PendonEngine();
