import React, { useState, useEffect, useRef } from 'react';
import { engine } from '../core/engine';
import { motion } from './motion';

interface Props {
  onClose: () => void;
}

export function CommandPalette({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'create-thought', label: 'Create Thought', icon: '💭', action: () => {
      const { camera } = engine.getState();
      const cx = (window.innerWidth / 2 - camera.x) / camera.z;
      const cy = (window.innerHeight / 2 - camera.y) / camera.z;
      engine.spawnNode(cx, cy);
    }},
    { id: 'create-frame', label: 'Create Frame', icon: '▭', action: () => {
      const { camera } = engine.getState();
      const cx = (window.innerWidth / 2 - camera.x) / camera.z;
      const cy = (window.innerHeight / 2 - camera.y) / camera.z;
      const id = engine.spawnNode(cx, cy);
      const state = engine.getState();
      if (state.nodes[id]) {
        state.nodes[id].objectTypeId = 'frame';
        state.nodes[id].width = 600;
        state.nodes[id].height = 400;
        engine.commitBehaviorStateHistory(); // just push history
      }
    }},
    { id: 'center-view', label: 'Center View', icon: '🎯', action: () => {
      engine.centerCamera();
    }},
    { id: 'toggle-zen', label: 'Toggle Zen Mode', icon: '🧘', action: () => {
      engine.toggleZenMode();
    }},
  ];

  const filteredCommands = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        animation: `palette-enter ${motion.spring.fast}`,
      }}
      onPointerDown={onClose}
    >
      <div 
        onPointerDown={e => e.stopPropagation()}
        style={{
          width: 600,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 24px 48px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9' }}>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands..."
            style={{
              width: '100%',
              fontSize: 20,
              fontFamily: 'inherit',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: '#0f172a',
            }}
          />
        </div>
        
        <div style={{ padding: 8, maxHeight: 400, overflowY: 'auto' }}>
          {filteredCommands.length === 0 && (
            <div style={{ padding: 16, color: '#94a3b8', textAlign: 'center' }}>
              No commands found
            </div>
          )}
          {filteredCommands.map((cmd, i) => (
            <div
              key={cmd.id}
              onClick={() => {
                cmd.action();
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(i)}
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                borderRadius: 8,
                background: selectedIndex === i ? '#f8fafc' : 'transparent',
                color: selectedIndex === i ? '#0f172a' : '#475569',
              }}
            >
              <span style={{ fontSize: 20 }}>{cmd.icon}</span>
              <span style={{ fontSize: 16, fontWeight: 500 }}>{cmd.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
