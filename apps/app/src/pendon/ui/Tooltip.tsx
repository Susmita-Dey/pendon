import React, { useState, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  shortcut?: string;
}

export function Tooltip({ children, content, shortcut }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (isHovered) {
      timeout = setTimeout(() => setIsVisible(true), 400); // Short hover delay
    } else {
      setIsVisible(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered]);

  return (
    <div 
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            marginBottom: 8,
            background: '#1e293b',
            color: '#f8fafc',
            padding: '4px 8px',
            borderRadius: 6,
            fontSize: 12,
            fontFamily: 'sans-serif',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'tooltip-fade-in 0.15s ease-out forwards',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <span style={{ fontWeight: 500 }}>{content}</span>
          {shortcut && (
            <span style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.1)', padding: '0 4px', borderRadius: 4 }}>
              {shortcut}
            </span>
          )}
          
          <style>
            {`
              @keyframes tooltip-fade-in {
                from { opacity: 0; transform: translateY(4px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}
