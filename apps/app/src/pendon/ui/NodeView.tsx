import React, { useState } from 'react';
import type { PendonNode } from '../core/types';
import { engine } from '../core/engine';
import { pluginRegistry } from '../core/registry';

interface Props {
  node: PendonNode;
  isEditing: boolean;
  isDragging: boolean;
}

export function NodeView({ node, isEditing, isDragging }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isResizeHovered, setIsResizeHovered] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    if ((e.target as HTMLElement).dataset.resize) {
      engine.startDraggingNode(node.id, 'resize');
    } else {
      engine.startDraggingNode(node.id, 'move');
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) { 
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

  // State calculations for CSS
  const isSelected = node.selected;
  
  // Dynamic CSS Tokens from Registry
  const styleDef = pluginRegistry.getStyle(node.styleId) || pluginRegistry.getStyle('paper')!;
  const objectTypeDef = pluginRegistry.getObjectType(node.objectTypeId) || pluginRegistry.getObjectType('note')!;
  const toneDef = pluginRegistry.getTone(node.toneId) || pluginRegistry.getTone('neutral')!;

  let scale = 1;
  let shadow = styleDef.shadow;
  let border = `1px solid ${styleDef.border}`;
  let background = styleDef.background;
  let textColor = styleDef.text;
  const accent = toneDef.accentColor || '#3b82f6';
  
  if (isDragging) {
    scale = 1.02;
    shadow = `0 16px 32px rgba(0, 0, 0, 0.1), 0 0 0 3px ${accent}33`;
    border = `1px solid ${accent}66`;
    background = '#FFFFFF';
  } else if (isEditing) {
    scale = 1;
    shadow = `0 12px 24px rgba(0, 0, 0, 0.08), 0 0 0 3px ${accent}4D`;
    border = `1px solid ${accent}80`;
    background = '#FFFFFF';
  } else if (isSelected) {
    scale = 1;
    shadow = `0 6px 16px rgba(0, 0, 0, 0.06), 0 0 0 3px ${accent}26`;
    border = `1px solid ${accent}66`;
  } else if (isHovered) {
    scale = 1.005;
    shadow = `0 6px 16px rgba(0, 0, 0, 0.06)`;
    border = `1px solid rgba(0, 0, 0, 0.08)`;
  }

  // Cursor logic: Text over the content, grab/grabbing over the padding
  const cursorStyle = isDragging ? 'grabbing' : (isHovered && !isEditing ? 'grab' : 'default');

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        background,
        border,
        borderRadius: 16,
        boxShadow: shadow,
        transform: `scale(${scale})`,
        transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
        WebkitFontSmoothing: 'antialiased',
        fontFamily: objectTypeDef.fontFamily,
        fontWeight: objectTypeDef.fontWeight,
        fontSize: 20,
        color: textColor,
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
        pointerEvents: 'all',
        userSelect: 'none',
        cursor: cursorStyle,
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
            textAlign: objectTypeDef.textAlign,
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            fontSize: 'inherit',
            color: 'inherit',
            lineHeight: 'inherit',
            letterSpacing: 'inherit',
            padding: 0,
            margin: 0,
            cursor: 'text',
          }}
          placeholder="Start typing..."
        />
      ) : (
        <span
          style={{
            width: '100%',
            maxHeight: '100%',
            textAlign: objectTypeDef.textAlign,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: node.text ? 'inherit' : '#cbd5e1',
            cursor: 'text',
          }}
        >
          {node.text || 'Start typing...'}
        </span>
      )}

      {/* Tone Icon */}
      {toneDef.icon && (
        <div style={{
          position: 'absolute',
          top: -16,
          left: -16,
          fontSize: 32,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10
        }}>
          {toneDef.icon}
        </div>
      )}

      {/* Resize Handle */}
      {isSelected && !isEditing && (
        <div
          data-resize="true"
          onMouseEnter={() => setIsResizeHovered(true)}
          onMouseLeave={() => setIsResizeHovered(false)}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            cursor: 'nwse-resize',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div 
            style={{ 
              width: isResizeHovered ? 12 : 8, 
              height: isResizeHovered ? 12 : 8, 
              background: isResizeHovered ? accent : '#94a3b8', 
              borderRadius: '50%',
              pointerEvents: 'none',
              transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }} 
          />
        </div>
      )}
    </div>
  );
}
