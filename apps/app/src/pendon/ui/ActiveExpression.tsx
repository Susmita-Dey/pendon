import React, { useEffect, useRef, useState } from 'react';
import { engine } from '../core/engine';

interface Props {
  x: number;
  y: number;
}

export function ActiveExpression({ x, y }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    // On the very first character, commit it to spawn the node and transfer focus
    if (e.target.value.length > 0) {
      engine.commitExpression(e.target.value, x, y);
    }
  };

  const handleBlur = () => {
    // If it loses focus while empty, cancel it
    if (text.length === 0) {
      engine.cancelExpression();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 99999,
      }}
    >
      <textarea
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          resize: 'none',
          padding: 0,
          margin: 0,
          fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: 20,
          fontWeight: 400,
          color: '#1e293b',
          lineHeight: 1.6,
          width: 2, // Minimal width just to show caret
          height: 32,
          overflow: 'hidden',
          caretColor: '#3b82f6',
        }}
      />
    </div>
  );
}
