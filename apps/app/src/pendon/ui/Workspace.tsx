import { useEffect, useState, useRef } from 'react';
import { engine } from '../core/engine';
import { NodeView } from './NodeView';
import { screenToWorkspace } from '../core/viewport/math';

export function Workspace() {
  const [state, setState] = useState(engine.getState());
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);

  // Subscribe to engine state
  useEffect(() => {
    return engine.subscribe(() => {
      setState({ ...engine.getState() }); // Shallow clone triggers re-render
    });
  }, []);

  // Native non-passive wheel listener for zooming/panning
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom or Ctrl+Scroll
        engine.zoom(e.deltaY, e.clientX, e.clientY);
      } else {
        // Trackpad panning
        engine.pan(-e.deltaX, -e.deltaY);
      }
    };
    
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Global Keyboard listener for Deletion & History
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (!isTyping && (e.key === 'Backspace' || e.key === 'Delete')) {
        engine.deleteSelectedNode();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          engine.redo();
        } else {
          engine.undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only pan on left-click background or middle-click
    if (e.button === 0 || e.button === 1) {
      isPanning.current = true;
      engine.selectNode(null);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning.current) {
      engine.pan(e.movementX, e.movementY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPanning.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    // Only spawn if clicking on the abstract workspace
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('workspace-world')) {
      const world = screenToWorkspace(e.clientX, e.clientY, state.camera);
      engine.spawnNode(world.x, world.y);
    }
  };

  const { x, y, z } = state.camera;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#f8fafc', // Very subtle calm gray/blue background
        touchAction: 'none',
        userSelect: 'none',
        cursor: isPanning.current ? 'grabbing' : 'default',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={e => e.preventDefault()}
    >
      <div
        className="workspace-world"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          transformOrigin: '0 0',
          transform: `matrix(${z}, 0, 0, ${z}, ${x}, ${y})`,
        }}
      >
        {/* Debug Origin Crosshair */}
        <div style={{ position: 'absolute', left: -50, top: -1, width: 100, height: 2, background: '#cbd5e1' }} />
        <div style={{ position: 'absolute', left: -1, top: -50, width: 2, height: 100, background: '#cbd5e1' }} />
        <span style={{ position: 'absolute', left: 8, top: 8, color: '#cbd5e1', fontFamily: 'monospace', fontSize: 12 }}>
          (0, 0)
        </span>
        
        {/* Nodes */}
        {Object.values(state.nodes).map(node => (
          <NodeView 
            key={node.id} 
            node={node} 
            isEditing={state.editingNodeId === node.id}
            isDragging={state.draggingNode?.id === node.id}
          />
        ))}
      </div>
    </div>
  );
}
