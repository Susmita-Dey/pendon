import React, { useRef, useEffect } from 'react';
import type { PendonNode, ChecklistItem } from '../../core/types';
import { engine } from '../../core/engine';
import { motion } from '../motion';

interface Props {
  node: PendonNode;
  isEditing: boolean;
}

export function ChecklistView({ node, isEditing }: Props) {
  const state = (node.behaviorState as { items: ChecklistItem[] }) || { items: [] };
  const items = state.items;

  // Track the ID of the item that should receive focus after a render
  const focusTarget = useRef<string | null>(null);
  
  // Ref map to store input elements for focus management
  const inputsRef = useRef<Map<string, HTMLInputElement>>(new Map());

  useEffect(() => {
    if (isEditing && focusTarget.current) {
      const input = inputsRef.current.get(focusTarget.current);
      if (input) {
        input.focus();
        input.selectionStart = input.value.length;
        input.selectionEnd = input.value.length;
      }
      focusTarget.current = null;
    }
  }, [items, isEditing]);

  const updateState = (newItems: ChecklistItem[]) => {
    engine.updateBehaviorState(node.id, { items: newItems });
  };

  const handleToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent dragging
    const newItems = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    updateState(newItems);
  };

  const handleChange = (id: string, text: string) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, text } : item
    );
    updateState(newItems);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const item = items[index];

    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Double Enter logic
      if (item.text === '' && index === items.length - 1) {
          // Exit checklist editing
          engine.setEditingNode(null);
          return;
      }

      const newItemId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const newItems = [...items];
      
      // Split text if cursor is in the middle? For simplicity, we just add a new item below.
      newItems.splice(index + 1, 0, { id: newItemId, text: '', checked: false });
      focusTarget.current = newItemId;
      updateState(newItems);
    } else if (e.key === 'Backspace') {
      if (item.text === '' && items.length > 1) {
        e.preventDefault();
        const newItems = [...items];
        newItems.splice(index, 1);
        if (index > 0) {
          focusTarget.current = newItems[index - 1].id;
        } else {
          focusTarget.current = newItems[0].id;
        }
        updateState(newItems);
      }
    } else if (e.key === 'ArrowUp') {
      if (index > 0) {
        e.preventDefault();
        inputsRef.current.get(items[index - 1].id)?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      if (index < items.length - 1) {
        e.preventDefault();
        inputsRef.current.get(items[index + 1].id)?.focus();
      }
    }
  };

  const handleBlur = () => {
     // Wait a tick to see if focus moved to another item within this checklist
     setTimeout(() => {
        if (!document.activeElement?.closest(`[data-checklist-id="${node.id}"]`)) {
           engine.setEditingNode(null);
        }
     }, 0);
  };

  return (
    <div 
      data-checklist-id={node.id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
        padding: '0 8px',
        animation: `slide-in ${motion.spring.medium}`,
      }}
    >
      <style>
        {`
          @keyframes slide-in {
            0% { opacity: 0; transform: translateX(-16px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes scale-up {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      
      {items.length === 0 && !isEditing && (
        <div style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>
          Empty Checklist
        </div>
      )}

      {items.map((item, index) => (
        <div 
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            opacity: item.checked ? 0.6 : 1,
            transition: `all ${motion.spring.fast}`,
          }}
        >
          <div 
            onClick={(e) => handleToggle(item.id, e)}
            onPointerDown={e => e.stopPropagation()}
            style={{
              width: 20,
              height: 20,
              flexShrink: 0,
              marginTop: 4,
              borderRadius: 6,
              border: `2px solid ${item.checked ? '#3b82f6' : '#cbd5e1'}`,
              background: item.checked ? '#3b82f6' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: `all ${motion.spring.fast}`,
              boxSizing: 'border-box'
            }}
          >
            {item.checked && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: `scale-up ${motion.spring.fast}` }}>
                <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          
          <div style={{ flex: 1, position: 'relative' }}>
            {isEditing ? (
              <input
                ref={(el) => {
                  if (el) inputsRef.current.set(item.id, el);
                  else inputsRef.current.delete(item.id);
                }}
                value={item.text}
                onChange={e => handleChange(item.id, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onBlur={handleBlur}
                onPointerDown={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                  fontWeight: 'inherit',
                  color: 'inherit',
                  padding: 0,
                  margin: 0,
                  marginTop: 2,
                  textDecoration: item.checked ? 'line-through' : 'none',
                }}
                placeholder="List item..."
              />
            ) : (
              <div style={{
                marginTop: 2,
                textDecoration: item.checked ? 'line-through' : 'none',
                wordBreak: 'break-word',
                color: item.text ? 'inherit' : '#94a3b8',
              }}>
                {item.text || 'Empty item'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
