import type { BehaviorViewProps } from '../../core/behavior/types';
import type { PlainState } from './types';

export function PlainView({ node, isEditing, updateText, morphTo }: BehaviorViewProps<PlainState>) {
  // If the text starts with '=' or looks like a math operation, we suggest morphing to Formula
  const looksLikeFormula = node.text.trim().startsWith('=');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 24,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: 24,
        background: '#fef9c3', // elegant sticky yellow
        border: '1px solid #fde047',
        borderRadius: 12,
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 10px -5px rgba(0,0,0,0.04)',
        pointerEvents: 'all',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {isEditing ? (
        <textarea
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none', 
            outline: 'none', 
            resize: 'none', 
            fontSize: 'inherit',
            fontFamily: 'inherit',
            background: 'transparent',
            textAlign: 'center',
            color: '#334155',
            lineHeight: '1.4',
          }}
          value={node.text}
          onChange={(e) => updateText(e.target.value)}
          autoFocus
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span 
          style={{ 
            textAlign: 'center', 
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap', 
            userSelect: 'none',
            color: node.text ? '#334155' : '#94a3b8',
            lineHeight: '1.4',
            width: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {node.text || 'Empty note'}
        </span>
      )}
      
      {looksLikeFormula && (
        <button
          onClick={() => morphTo('formula')}
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            padding: '4px 12px',
            background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 16,
            fontSize: 12,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          ✨ Morph to Formula
        </button>
      )}
    </div>
  );
}
