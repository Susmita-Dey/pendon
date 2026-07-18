import React, { useState, useEffect, useRef } from 'react';
import { engine } from '../core/engine';
import { motion } from './motion';

interface Props {
  onClose: () => void;
}

export function SearchPalette({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const state = engine.getState();
  
  const results = Object.values(state.nodes).filter(node => 
    node.text && node.text.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        engine.flyToNode(results[selectedIndex].id);
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
            placeholder="Search canvas..."
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
          {results.length === 0 && (
            <div style={{ padding: 16, color: '#94a3b8', textAlign: 'center' }}>
              {query ? 'No results found' : 'Type to search...'}
            </div>
          )}
          {results.map((node, i) => (
            <div
              key={node.id}
              onClick={() => {
                engine.flyToNode(node.id);
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
              <span style={{ fontSize: 20 }}>
                {node.objectTypeId === 'frame' ? '▭' : (node.behavior.id === 'checklist' ? '✓' : '💭')}
              </span>
              <span style={{ fontSize: 16, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {node.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
