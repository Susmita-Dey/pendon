import React from 'react';
import { engine } from '../core/engine';
import { motion } from './motion';
import type { PendonNode } from '../core/types';

interface Props {
  nodeId: string;
}

export function ThoughtDock({ nodeId }: Props) {
  const state = engine.getState();
  const node = state.nodes[nodeId];

  if (!node) return null;

  let label = 'Thought';
  let icon = '💭';

  if (node.objectTypeId === 'frame') {
    label = 'Frame';
    icon = '▭';
  } else if (node.behavior.id === 'checklist') {
    label = 'Checklist';
    icon = '✓';
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        padding: '8px 16px',
        borderRadius: 24,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        fontWeight: 500,
        color: '#475569',
        zIndex: 9999,
        animation: `palette-enter ${motion.spring.fast}`,
        pointerEvents: 'none',
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
      
      {state.zenMode && (
         <div style={{ marginLeft: 8, paddingLeft: 12, borderLeft: '1px solid #e2e8f0', color: '#94a3b8' }}>
            Zen Mode
         </div>
      )}
    </div>
  );
}
