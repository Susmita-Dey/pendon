import React, { useEffect } from 'react';
import { engine } from '../core/engine';
import { motion } from './motion';

interface Props {
  x: number;
  y: number;
  nodeId: string | null;
  onClose: () => void;
}

export function ContextMenu({ x, y, nodeId, onClose }: Props) {
  
  useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [onClose]);

  const handleAction = (e: React.PointerEvent, action: () => void) => {
    e.stopPropagation();
    action();
    onClose();
  };

  const menuStyle: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: y,
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 12px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
    padding: '8px 0',
    minWidth: 200,
    zIndex: 10000,
    animation: `palette-enter ${motion.spring.fast}`,
    transformOrigin: 'top left',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const Item = ({ label, onClick, divider }: { label: string, onClick?: () => void, divider?: boolean }) => {
    if (divider) return <div style={{ height: 1, background: '#f1f5f9', margin: '4px 0' }} />;
    return (
      <div
        onPointerDown={(e) => onClick && handleAction(e, onClick)}
        style={{
          padding: '6px 16px',
          fontSize: 14,
          color: '#334155',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {label}
      </div>
    );
  };

  const Header = ({ label }: { label: string }) => (
    <div style={{ padding: '4px 16px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em' }}>
      {label}
    </div>
  );

  return (
    <div 
      style={menuStyle}
      onPointerDown={e => e.stopPropagation()}
      onContextMenu={e => { e.preventDefault(); e.stopPropagation(); }}
    >
      {nodeId ? (
        <>
          <Header label="Transform into" />
          <Item label="Checklist" onClick={() => engine.upgradeNodeBehavior(nodeId, 'checklist', {}, '')} />
          <Item label="Formula" onClick={() => {}} />
          <Item label="Timeline" onClick={() => {}} />
          <Item divider />
          <Header label="Create" />
          <Item label="Frame" onClick={() => {}} />
          <Item label="Connection" onClick={() => {}} />
          <Item label="Divider" onClick={() => {}} />
          <Item divider />
          <Item label="Style" onClick={() => {}} />
          <Item divider />
          <Item label="Duplicate" onClick={() => { engine.selectNode(nodeId); engine.duplicateSelectedNodes(); }} />
          <Item label="Delete" onClick={() => { engine.selectNode(nodeId); engine.deleteSelectedNodes(); }} />
        </>
      ) : (
        <>
          <Header label="Create" />
          <Item label="Thought" onClick={() => {}} />
          <Item label="Checklist" onClick={() => {}} />
          <Item label="Frame" onClick={() => {}} />
        </>
      )}
    </div>
  );
}
