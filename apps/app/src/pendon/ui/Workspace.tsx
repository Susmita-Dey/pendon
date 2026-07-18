import { useEffect, useState, useRef } from 'react';
import { engine } from '../core/engine';
import { NodeView } from './NodeView';
import { ObjectPalette } from './Palette/ObjectPalette';
import { screenToWorkspace } from '../core/viewport/math';
import type { AlignmentGuide, DistanceIndicator } from '../core/types';

const LAYER_ORDER = {
  'frame': 0,
  'node': 1,
  'overlay': 2,
};

export function Workspace() {
  const [state, setState] = useState(engine.getState());
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const isSpacePressed = useRef(false);
  
  // Marquee threshold
  const dragStartPos = useRef<{x: number, y: number} | null>(null);
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);

  // Subscribe to engine state
  useEffect(() => {
    return engine.subscribe(() => {
      setState({ ...engine.getState() });
    });
  }, []);

  // Native non-passive wheel listener for zooming/panning
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        engine.zoom(e.deltaY, e.clientX, e.clientY);
      } else {
        engine.pan(-e.deltaX, -e.deltaY);
      }
    };
    
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Global Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.code === 'Space' && !isTyping) {
        e.preventDefault();
        isSpacePressed.current = true;
        if (containerRef.current) {
          containerRef.current.style.cursor = 'grab';
        }
      }

      if (!isTyping) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
          engine.deleteSelectedNodes();
        }
        
        if (e.ctrlKey || e.metaKey) {
          switch (e.key.toLowerCase()) {
            case 'z':
              if (e.shiftKey) engine.redo();
              else engine.undo();
              e.preventDefault();
              break;
            case 'd':
              engine.duplicateSelectedNodes();
              e.preventDefault();
              break;
            case 'c':
              engine.copySelectedNodes();
              break;
            case 'x':
              engine.cutSelectedNodes();
              break;
            case 'v':
              engine.pasteNodes();
              break;
          }
        } else if (e.key.startsWith('Arrow')) {
          e.preventDefault();
          const amount = e.shiftKey ? 50 : 10;
          let dx = 0, dy = 0;
          if (e.key === 'ArrowUp') dy = -amount;
          if (e.key === 'ArrowDown') dy = amount;
          if (e.key === 'ArrowLeft') dx = -amount;
          if (e.key === 'ArrowRight') dx = amount;
          engine.nudgeSelectedNodes(dx, dy);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressed.current = false;
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const isMiddleClick = e.button === 1;
    const isLeftClick = e.button === 0;

    if (isSpacePressed.current || isMiddleClick) {
      isPanning.current = true;
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    } else if (isLeftClick) {
      // Start potential marquee
      dragStartPos.current = { x: e.clientX, y: e.clientY };
    }
    
    // Deselect if not shift/ctrl clicking and not panning
    if (!isSpacePressed.current && !isMiddleClick && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
       engine.selectNode(null);
    }
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning.current) {
      engine.pan(e.movementX, e.movementY);
    } else if (dragStartPos.current) {
      // Check drag threshold for marquee
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      if (!isMarqueeActive && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        setIsMarqueeActive(true);
        const worldStart = screenToWorkspace(dragStartPos.current.x, dragStartPos.current.y, state.camera);
        engine.startSelectionBox(worldStart.x, worldStart.y);
      }
      
      if (isMarqueeActive) {
        const worldCurrent = screenToWorkspace(e.clientX, e.clientY, state.camera);
        engine.updateSelectionBox(worldCurrent.x, worldCurrent.y);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isPanning.current = false;
    dragStartPos.current = null;
    
    if (isSpacePressed.current && containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    } else if (containerRef.current) {
      containerRef.current.style.cursor = 'default';
    }

    if (isMarqueeActive) {
      setIsMarqueeActive(false);
      engine.endSelectionBox();
    }
    
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('workspace-world')) {
      const world = screenToWorkspace(e.clientX, e.clientY, state.camera);
      engine.spawnNode(world.x, world.y);
    }
  };

  const { x, y, z } = state.camera;
  
  // Render Marquee Box
  let marqueeStyle: React.CSSProperties = { display: 'none' };
  if (isMarqueeActive && state.selectionBox) {
    const { startX, startY, currentX, currentY } = state.selectionBox;
    const left = Math.min(startX, currentX);
    const top = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    marqueeStyle = {
      position: 'absolute',
      left,
      top,
      width,
      height,
      border: '1px solid #3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointerEvents: 'none',
      zIndex: 9999,
    };
  }

  const nodesList = Object.values(state.nodes).sort((a, b) => {
    if (LAYER_ORDER[a.layer] !== LAYER_ORDER[b.layer]) {
       return LAYER_ORDER[a.layer] - LAYER_ORDER[b.layer];
    }
    return a.zIndex - b.zIndex;
  });
  
  const isEmpty = nodesList.length === 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#ffffff', // Calmer, less noisy background (pure white/invisible)
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onContextMenu={e => e.preventDefault()}
    >
      {isEmpty && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#94a3b8',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          pointerEvents: 'none',
          animation: 'fade-in 1s ease-in-out',
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Double-click anywhere to create a thought.</p>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Press Space + Drag to move around.</p>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Press Ctrl/Cmd + K for commands.</p>
        </div>
      )}
      
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
        {/* Nodes */}
        {nodesList.map(node => (
          <NodeView 
            key={node.id} 
            node={node} 
            isEditing={state.editingNodeId === node.id}
            isDragging={state.draggingNode?.id === node.id}
          />
        ))}

        {/* Alignment Guides */}
        {state.alignmentGuides.map((guide: AlignmentGuide) => (
           <div 
             key={guide.id}
             style={{
               position: 'absolute',
               left: guide.type === 'vertical' ? guide.x : guide.x,
               top: guide.type === 'vertical' ? guide.y : guide.y,
               width: guide.type === 'vertical' ? 1 : guide.length,
               height: guide.type === 'vertical' ? guide.length : 1,
               background: '#3b82f6',
               opacity: 0.4,
               pointerEvents: 'none',
               zIndex: 9998,
             }}
           />
        ))}

        {/* Marquee */}
        <div style={marqueeStyle} />

        {/* Object Palette - Render for first selected node */}
        {state.selectedNodeIds.length > 0 && !state.draggingNode && !state.editingNodeId && !isMarqueeActive && state.nodes[state.selectedNodeIds[0]] && (
          <ObjectPalette node={state.nodes[state.selectedNodeIds[0]]} zoom={z} />
        )}
        
        {/* Auto Layout Suggestion */}
        {state.layoutSuggestion && !state.draggingNode && (
          <div
            onPointerDown={(e) => {
               e.stopPropagation();
               engine.applyLayoutSuggestion();
            }}
            style={{
               position: 'absolute',
               left: state.layoutSuggestion.x,
               top: state.layoutSuggestion.y,
               transform: `translate(-50%, -50%) scale(${1/z})`,
               background: '#1e293b',
               color: '#fff',
               padding: '4px 12px',
               borderRadius: 24,
               fontSize: 12,
               fontWeight: 500,
               cursor: 'pointer',
               boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
               zIndex: 9999,
               animation: 'palette-enter 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            Align
          </div>
        )}
      </div>
    </div>
  );
}
