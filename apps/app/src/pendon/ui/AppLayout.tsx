import React from 'react';
import { engine } from '../core/engine';
import { motion } from './motion';
import { Workspace } from './Workspace';

export function AppLayout() {
  const [state, setState] = React.useState(engine.getState());

  React.useEffect(() => {
    return engine.subscribe(() => {
      setState(engine.getState());
    });
  }, []);

  const tools = [
    { id: 'pointer', icon: '↖', label: 'Move' },
    { id: 'express', icon: '✏', label: 'Express' },
    { id: 'frame', icon: '□', label: 'Frame' },
    { id: 'connect', icon: '→', label: 'Connect' },
  ] as const;

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* The main canvas */}
      <Workspace />

      {/* Top Navigation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'all' }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: '#0f172a' }}>Pendon</span>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ fontWeight: 500, fontSize: 15, color: '#475569' }}>Untitled Workspace</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, pointerEvents: 'all' }}>
          <button style={{ background: 'transparent', border: 'none', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>Search</button>
          <button style={{ background: 'transparent', border: 'none', fontWeight: 500, color: '#475569', cursor: 'pointer' }}>Share</button>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: '#e2e8f0' }} />
        </div>
      </div>

      {/* Left Tool Rail */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: '#ffffff',
          padding: 8,
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
          pointerEvents: 'all',
          zIndex: 1000,
        }}
      >
        {tools.map(tool => {
          const isActive = state.activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => engine.setActiveTool(tool.id)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                border: 'none',
                background: isActive ? '#f1f5f9' : 'transparent',
                color: isActive ? '#0f172a' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={tool.label}
            >
              {tool.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
