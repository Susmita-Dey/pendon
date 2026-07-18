import type { PendonNode } from '../core/types';
import { engine } from '../core/engine';

interface Props {
  node: PendonNode;
  isEditing: boolean;
}

export function NodeView({ node, isEditing }: Props) {
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    // If clicking on the resize handle, don't move
    if ((e.target as HTMLElement).dataset.resize) {
      engine.startDraggingNode(node.id, 'resize');
    } else {
      engine.startDraggingNode(node.id, 'move');
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) { // Left click held
      engine.dragNode(e.movementX, e.movementY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    engine.stopDragging();
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    engine.setEditingNode(node.id);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        top: node.y,
        left: node.x,
        width: node.width,
        height: node.height,
        padding: 32,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.04)',
        borderRadius: 16,
        boxShadow: node.selected 
          ? '0 0 0 2px #3b82f6, 0 12px 32px rgba(0, 0, 0, 0.08)' 
          : '0 12px 32px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02)',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 20,
        color: '#334155',
        lineHeight: 1.6,
        pointerEvents: 'all',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {isEditing ? (
        <textarea
          autoFocus
          value={node.text}
          onChange={e => engine.updateNodeText(node.id, e.target.value)}
          onBlur={() => engine.setEditingNode(null)}
          onPointerDown={e => e.stopPropagation()} // Let user click inside text
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            textAlign: 'center',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            color: 'inherit',
            lineHeight: 'inherit',
          }}
        />
      ) : (
        <span
          style={{
            width: '100%',
            maxHeight: '100%',
            textAlign: 'center',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {node.text}
        </span>
      )}

      {/* Resize Handle */}
      {node.selected && !isEditing && (
        <div
          data-resize="true"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 20,
            height: 20,
            cursor: 'nwse-resize',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 8, height: 8, background: '#cbd5e1', borderRadius: '50%', pointerEvents: 'none' }} />
        </div>
      )}
    </div>
  );
}
