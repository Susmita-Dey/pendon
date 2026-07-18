import React, { useState } from 'react';
import type { PendonNode } from '../core/types';
import { engine } from '../core/engine';
import { pluginRegistry } from '../core/registry';
import { ChecklistView } from './behaviors/ChecklistView';
import { detectChecklistIntent, textToChecklist, detectPlainThoughtIntent, checklistToText } from '../core/behaviors/checklist';
import { motion } from './motion';

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
    if (isEditing) return; // Prevent dragging while editing

    const additive = e.shiftKey || e.ctrlKey || e.metaKey;
    if ((e.target as HTMLElement).dataset.resize) {
      engine.startDraggingNode(node.id, 'resize', additive);
    } else {
      engine.startDraggingNode(node.id, 'move', additive);
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1 && !isEditing) { 
      engine.dragNode(e.movementX, e.movementY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isEditing) {
      engine.stopDragging();
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    engine.setEditingNode(node.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      engine.setEditingNode(null);
    }
  };

  const handleNodeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isEditing) {
      e.stopPropagation();
      engine.setEditingNode(node.id);
    }
  };

  // State calculations for CSS
  const isSelected = node.selected;
  
  // Dynamic CSS Tokens from Registry
  const styleDef = pluginRegistry.getStyle(node.styleId) || pluginRegistry.getStyle('paper')!;
  const objectTypeDef = pluginRegistry.getObjectType(node.objectTypeId) || pluginRegistry.getObjectType('note')!;
  const toneDef = pluginRegistry.getTone(node.toneId) || pluginRegistry.getTone('neutral')!;

  // Behavior detection
  const isPlain = node.behavior.id === 'plain';
  const isChecklist = node.behavior.id === 'checklist';
  const showChecklistBadge = isEditing && isPlain && detectChecklistIntent(node.text);
  const showThoughtBadge = isEditing && isChecklist && detectPlainThoughtIntent(node.behaviorState?.items || []);

  const handleUpgradeToChecklist = (e: React.PointerEvent) => {
    e.stopPropagation();
    const initialState = textToChecklist(node.text);
    engine.upgradeNodeBehavior(node.id, 'checklist', initialState, '');
  };

  const handleRevertToThought = (e: React.PointerEvent) => {
    e.stopPropagation();
    // Revert without text since the items were empty
    engine.upgradeNodeBehavior(node.id, 'plain', {}, '');
  };

  let scale = 1;
  let shadow = styleDef.shadow;
  let border = `1px solid ${styleDef.border}`;
  let background = styleDef.background;
  let textColor = styleDef.text;
  const accent = toneDef.accentColor || '#3b82f6';
  const isFrame = node.objectTypeId === 'frame';
  
  if (isFrame) {
    background = isSelected ? 'rgba(59, 130, 246, 0.02)' : 'transparent';
    border = `2px dashed ${isSelected ? accent : '#cbd5e1'}`;
    shadow = 'none';
  } else {
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
  }

  // Cursor logic: Text over the content, grab/grabbing over the padding
  const cursorStyle = isEditing ? 'text' : (isDragging ? 'grabbing' : (isHovered ? 'grab' : 'default'));
  
  const springTransition = isDragging 
    ? 'none' 
    : 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.25s, border 0.25s, background 0.25s';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Thought: ${node.text || 'Empty'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleNodeKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        top: node.y,
        left: node.x,
        width: node.width,
        height: node.height,
        padding: isFrame ? '32px 32px' : 32,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: isFrame ? 'flex-start' : 'center',
        justifyContent: isFrame ? 'flex-start' : 'center',
        background,
        border,
        borderRadius: isFrame ? 24 : 16,
        boxShadow: shadow,
        transform: `scale(${scale})`,
        transition: springTransition,
        WebkitFontSmoothing: 'antialiased',
        fontFamily: objectTypeDef.fontFamily,
        fontWeight: objectTypeDef.fontWeight,
        fontSize: isFrame ? 24 : 20,
        color: textColor,
        lineHeight: 1.6,
        letterSpacing: '-0.01em',
        pointerEvents: 'all',
        userSelect: 'none',
        cursor: cursorStyle,
        outline: 'none',
      }}
    >
      {isPlain ? (
        isEditing ? (
          <textarea
            autoFocus
            value={node.text}
            onChange={e => engine.updateNodeText(node.id, e.target.value)}
            onBlur={() => engine.setEditingNode(null)}
            onPointerDown={e => e.stopPropagation()} // Let user click inside text
            onKeyDown={handleKeyDown}
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
              color: node.text ? (isFrame ? '#94a3b8' : 'inherit') : '#cbd5e1',
              cursor: 'text',
              opacity: isFrame && !node.text ? 0 : 1, // Hide placeholder for frames unless hovered
            }}
          >
            {node.text || (isFrame ? 'Frame Title' : 'Start typing...')}
          </span>
        )
      ) : isChecklist ? (
        <ChecklistView node={node} isEditing={isEditing} />
      ) : null}

      {/* Detection Badges */}
      {showChecklistBadge && (
        <div
          onPointerDown={handleUpgradeToChecklist}
          style={{
            position: 'absolute',
            bottom: -32,
            right: 0,
            background: '#ffffff',
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 500,
            color: '#3b82f6',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            animation: `palette-enter ${motion.spring.fast}`,
            zIndex: 100,
          }}
        >
          ✨ Checklist available
        </div>
      )}

      {showThoughtBadge && (
        <div
          onPointerDown={handleRevertToThought}
          style={{
            position: 'absolute',
            bottom: -32,
            right: 0,
            background: '#ffffff',
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: 13,
            fontWeight: 500,
            color: '#64748b',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            animation: `palette-enter ${motion.spring.fast}`,
            zIndex: 100,
          }}
        >
          ✨ Convert to thought
        </div>
      )}

      {/* Tone Icon */}
      {toneDef.icon && !isFrame && (
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
