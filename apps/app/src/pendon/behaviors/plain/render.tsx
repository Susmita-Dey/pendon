import { HTMLContainer } from 'tldraw';
import type { BehaviorRenderProps } from '../../engine/registry';
import type { PlainState } from './types';

export function PlainRender({ shape, isEditing, updateText }: BehaviorRenderProps<PlainState>) {
  return (
    <HTMLContainer
      id={shape.id}
      style={{
        width: '100%',
        height: '100%',
        padding: 16,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontSize: 24,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 8,
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        pointerEvents: 'all',
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
            fontSize: 24, 
            background: 'transparent',
            textAlign: 'center'
          }}
          value={shape.props.text}
          onChange={(e) => updateText(e.target.value)}
          autoFocus
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span style={{ textAlign: 'center', wordBreak: 'break-word', userSelect: 'none' }}>
          {shape.props.text || 'Empty note'}
        </span>
      )}
    </HTMLContainer>
  );
}
