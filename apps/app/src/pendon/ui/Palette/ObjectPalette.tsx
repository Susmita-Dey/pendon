import { useState } from 'react';
import { engine } from '../../core/engine';
import { pluginRegistry } from '../../core/registry';
import { Popover } from './Popover';
import type { PendonNode } from '../../core/types';

interface Props {
  node: PendonNode;
  zoom: number;
}

export function ObjectPalette({ node, zoom }: Props) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = pluginRegistry.getPaletteSections().filter(section => {
    if (section.isVisible) {
      return section.isVisible(node.behavior.id);
    }
    return true;
  });

  const renderPopoverContent = (sectionId: string) => {
    switch (sectionId) {
      case 'style':
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {pluginRegistry.getStyles().map(style => (
              <button
                key={style.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  engine.updateNodeStyle(node.id, style.id);
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: style.background,
                  border: `2px solid ${node.styleId === style.id ? '#3b82f6' : style.border}`,
                  cursor: 'pointer',
                  padding: 0,
                  boxShadow: style.shadow,
                }}
                title={style.label}
              />
            ))}
          </div>
        );
      
      case 'type':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pluginRegistry.getObjectTypes().map(type => (
              <button
                key={type.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  engine.updateNodeObjectType(node.id, type.id);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: node.objectTypeId === type.id ? '#f1f5f9' : 'transparent',
                  color: node.objectTypeId === type.id ? '#0f172a' : '#475569',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: type.fontFamily,
                  fontWeight: type.fontWeight,
                  fontSize: 14,
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        );

      case 'tone':
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {pluginRegistry.getTones().map(tone => (
              <button
                key={tone.id}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  engine.updateNodeTone(node.id, tone.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: node.toneId === tone.id ? (tone.accentColor || '#3b82f6') : 'transparent',
                  background: node.toneId === tone.id ? '#f8fafc' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#334155',
                }}
              >
                {tone.icon && <span>{tone.icon}</span>}
                {tone.label}
              </button>
            ))}
          </div>
        );

      case 'behavior':
      case 'connections':
      case 'properties':
        return (
          <div style={{ fontSize: 13, color: '#94a3b8', padding: 12, textAlign: 'center', fontStyle: 'italic' }}>
            Available in future extensions
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: node.y - 16, // Hovering 16px above the node
        left: node.x + node.width / 2,
        transform: `scale(${1 / zoom})`,
        transformOrigin: 'bottom center',
        zIndex: 50,
        pointerEvents: 'none', // Let outer container pass clicks
      }}
    >
      <div
        style={{
          transform: 'translateX(-50%) translateY(-100%)',
          display: 'flex',
          gap: 4,
          padding: 6,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          animation: 'palette-enter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          pointerEvents: 'all',
        }}
        onPointerDown={e => e.stopPropagation()} // Prevent deselecting
      >
        {sections.map(section => (
        <div key={section.id} style={{ position: 'relative' }}>
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              setActiveSection(activeSection === section.id ? null : section.id);
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: 'none',
              background: activeSection === section.id ? '#f1f5f9' : 'transparent',
              color: activeSection === section.id ? '#0f172a' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              transition: 'all 0.15s ease',
            }}
            title={section.label}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = activeSection === section.id ? '#f1f5f9' : '#f8fafc';
              (e.currentTarget as HTMLButtonElement).style.color = '#0f172a';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = activeSection === section.id ? '#f1f5f9' : 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = activeSection === section.id ? '#0f172a' : '#64748b';
            }}
          >
            {section.icon}
          </button>
          
          <Popover 
            isOpen={activeSection === section.id} 
            onClose={() => setActiveSection(null)}
            title={section.label}
          >
            {renderPopoverContent(section.id)}
          </Popover>
        </div>
      ))}
        <style>
          {`
            @keyframes palette-enter {
              0% { opacity: 0; transform: translateX(-50%) translateY(-100%) translateY(16px) scale(0.9); }
              100% { opacity: 1; transform: translateX(-50%) translateY(-100%) scale(1); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
