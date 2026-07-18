import { useEffect, useState, useRef } from 'react';
import { engine } from '../core/engine';
import { NodeView } from './NodeView';
import { ObjectPalette } from './Palette/ObjectPalette';
import { CommandPalette } from './CommandPalette';
import { SearchPalette } from './SearchPalette';
import { ContextMenu } from './ContextMenu';
import { ThoughtDock } from './ThoughtDock';
import { ActiveExpression } from './ActiveExpression';
import { screenToWorkspace } from '../core/viewport/math';
import { expressionEngine } from '../core/expression/engine';
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<{ x: number, y: number, text: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string | null } | null>(null);

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
        
        if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
           engine.toggleZenMode();
           e.preventDefault();
        }
        
        if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
           e.preventDefault();
           const { camera } = engine.getState();
           const cx = (window.innerWidth / 2 - camera.x) / camera.z;
           const cy = (window.innerHeight / 2 - camera.y) / camera.z;
           engine.beginExpression(cx, cy);
        }
        
        if (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey)) {
           e.preventDefault();
           setIsCommandPaletteOpen(true);
        }
        
        if (e.key.toLowerCase() === 'f' && (e.ctrlKey || e.metaKey)) {
           e.preventDefault();
           setIsSearchPaletteOpen(true);
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
    setContextMenu(null);
    const isMiddleClick = e.button === 1;
    const isLeftClick = e.button === 0;

    if (isSpacePressed.current || isMiddleClick) {
      isPanning.current = true;
      if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    } else if (isLeftClick) {
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      const world = screenToWorkspace(e.clientX, e.clientY, state.camera);
      
      if (state.activeTool === 'express') {
        engine.beginStroke(world.x, world.y);
      }
    }
    
    if (!isSpacePressed.current && !isMiddleClick && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
       engine.selectNode(null);
    }
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning.current) {
      engine.pan(e.movementX, e.movementY);
    } else if (state.activeStroke) {
      const world = screenToWorkspace(e.clientX, e.clientY, state.camera);
      engine.updateStroke(world.x, world.y);
    } else if (dragStartPos.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      if (!isMarqueeActive && (Math.abs(dx) > 5 || Math.abs(dy) > 5) && state.activeTool === 'pointer') {
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
    
    // Check if it was a quick click without panning or drag marquee
    let wasClick = false;
    if (dragStartPos.current) {
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
        wasClick = true;
      }
    }
    dragStartPos.current = null;
    
    if (isSpacePressed.current && containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    } else if (containerRef.current) {
      containerRef.current.style.cursor = getCursorForTool(state.activeTool);
    }

    if (isMarqueeActive) {
      setIsMarqueeActive(false);
      engine.endSelectionBox();
    } else if (state.activeStroke) {
      const stroke = engine.endStroke();
      if (stroke && stroke.points.length > 0) {
        const result = expressionEngine.recognizeStroke(stroke.points);
        if (result.confidence > 0.85) {
          // Show suggestion at the end of the stroke
          const lastPoint = stroke.points[stroke.points.length - 1];
          let text = 'Convert to Object';
          if (result.suggestion === 'frame') text = '✨ Convert to Frame';
          if (result.suggestion === 'thought') text = '✨ Convert to Thought';
          if (result.suggestion === 'connection') text = '✨ Connect';
          setSuggestion({ x: lastPoint.x, y: lastPoint.y, text });
          
          // Auto-hide suggestion after 3 seconds
          setTimeout(() => setSuggestion(null), 3000);
        }
      }
    } else if (wasClick && !e.shiftKey && !e.ctrlKey && !e.metaKey && !isSpacePressed.current) {
      // It was a click on the canvas background
      if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('workspace-world')) {
        const world = screenToWorkspace(e.clientX, e.clientY, state.camera);
        
        if (state.activeTool === 'pointer') {
          setSuggestion(null);
          engine.beginExpression(world.x, world.y);
        }
      }
    }
    
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const getCursorForTool = (tool: string) => {
    switch (tool) {
      case 'express': return 'crosshair'; // Will be replaced with custom SVG later
      case 'frame': return 'cell';
      case 'connect': return 'alias';
      default: return 'default';
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
      onContextMenu={e => {
        e.preventDefault();
        // Check if we clicked on a node
        let targetNodeId = null;
        let el = e.target as HTMLElement;
        while (el && el.classList && !el.classList.contains('workspace-world')) {
          if (el.getAttribute('data-node-id')) {
            targetNodeId = el.getAttribute('data-node-id');
            break;
          }
          el = el.parentElement as HTMLElement;
        }
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId: targetNodeId });
      }}
    >
      {state.activeTool === 'express' && (
        <div style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#94a3b8',
          fontFamily: 'sans-serif',
          textAlign: 'center',
          pointerEvents: 'none',
          animation: 'fade-in 0.5s ease-in-out',
          zIndex: 10,
        }}>
          <p style={{ fontSize: '1rem', opacity: 0.8 }}>Draw... a box → Frame | a circle → Thought | an arrow → Connection | numbers → Formula</p>
        </div>
      )}

      {isEmpty && state.activeTool === 'pointer' && !state.activeExpression && (
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
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Click anywhere to think.</p>
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
        {nodesList.map(node => {
          const isEditing = state.editingNodeId === node.id;
          const isFaded = state.editingNodeId !== null && state.editingNodeId !== node.id;
          return (
            <NodeView 
              key={node.id} 
              node={node} 
              isEditing={isEditing}
              isDragging={state.draggingNode?.id === node.id}
              isFaded={isFaded}
              zenMode={state.zenMode}
            />
          );
        })}

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
        
        {/* Active Expression Session */}
        {state.activeExpression && (
          <ActiveExpression x={state.activeExpression.x} y={state.activeExpression.y} />
        )}
        {/* Active Stroke */}
        {state.activeStroke && (
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 9999 }}>
            <polyline
              points={state.activeStroke.points.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#0f172a"
              strokeWidth={4 / z}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {/* Suggestion Badge */}
        {suggestion && (
          <div
            style={{
               position: 'absolute',
               left: suggestion.x,
               top: suggestion.y + 20,
               transform: `scale(${1/z})`,
               background: '#ffffff',
               color: '#3b82f6',
               padding: '6px 12px',
               borderRadius: 16,
               fontSize: 13,
               fontWeight: 500,
               cursor: 'pointer',
               boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
               border: '1px solid #e2e8f0',
               zIndex: 10000,
               animation: 'palette-enter 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setSuggestion(null);
            }}
          >
            {suggestion.text}
          </div>
        )}

      </div>
      
      {state.editingNodeId && <ThoughtDock nodeId={state.editingNodeId} />}
      {!state.editingNodeId && state.selectedNodeIds.length === 1 && <ThoughtDock nodeId={state.selectedNodeIds[0]} />}
      
      {isCommandPaletteOpen && <CommandPalette onClose={() => setIsCommandPaletteOpen(false)} />}
      {isSearchPaletteOpen && <SearchPalette onClose={() => setIsSearchPaletteOpen(false)} />}
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
