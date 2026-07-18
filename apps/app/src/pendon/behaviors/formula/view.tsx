import type { BehaviorViewProps } from '../../core/behavior/types';
import type { FormulaState } from './types';


function calculateTotal(text: string): number {
  const numbers = text.match(/-?\d+(\.\d+)?/g);
  if (!numbers) return 0;
  return numbers.reduce((sum, num) => sum + parseFloat(num), 0);
}

export function FormulaView(props: BehaviorViewProps<FormulaState>) {
  const { node, isEditing, updateText } = props;
  const total = calculateTotal(node.text);
  
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: 16,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'inherit',
        background: '#f8fafc',
        border: '2px solid #3b82f6',
        borderRadius: 8,
        boxShadow: '0 4px 6px rgba(59,130,246,0.1)',
        pointerEvents: 'all',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 12, fontWeight: 'bold', color: '#3b82f6', marginBottom: 8, letterSpacing: '0.05em' }}>
          FORMULA
        </div>
        {isEditing ? (
          <textarea
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none', 
              outline: 'none', 
              resize: 'none', 
              fontSize: 20, 
              background: 'transparent',
              fontFamily: 'monospace',
            }}
            value={node.text}
            onChange={(e) => updateText(e.target.value)}
            autoFocus
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 20, overflow: 'auto', fontFamily: 'monospace' }}>
            {node.text || 'Enter numbers...'}
          </div>
        )}
      </div>
      <div style={{ 
        marginTop: 'auto', 
        paddingTop: 8, 
        borderTop: '1px solid #bfdbfe', 
        fontSize: 24, 
        fontWeight: 'bold', 
        textAlign: 'right',
        color: '#1e40af'
      }}>
        Total: {total}
      </div>
    </div>
  );
}
