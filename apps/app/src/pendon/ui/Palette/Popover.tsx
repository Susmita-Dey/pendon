

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Popover({ isOpen, onClose, children, title }: Props) {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div 
        style={{ position: 'fixed', inset: 0, zIndex: 99 }} 
        onPointerDown={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      
      {/* Popover Card */}
      <div
        onPointerDown={(e) => e.stopPropagation()} // Keep clicks inside
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-12px)',
          marginBottom: 12,
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          padding: 16,
          width: 260,
          zIndex: 100,
          animation: 'popover-spring 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          transformOrigin: 'bottom center',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          cursor: 'default',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
        <div>
          {children}
        </div>
      </div>
      <style>
        {`
          @keyframes popover-spring {
            0% { opacity: 0; transform: translateX(-50%) translateY(0) scale(0.95); }
            100% { opacity: 1; transform: translateX(-50%) translateY(-12px) scale(1); }
          }
        `}
      </style>
    </>
  );
}
