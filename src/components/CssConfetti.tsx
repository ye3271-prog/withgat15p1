import React, { useMemo } from 'react';

const COLORS = [
  '#f59e0b', // amber
  '#ef4444', // red
  '#10b981', // emerald
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#fbbf24', // yellow
];

interface ConfettiPiece {
  id: number;
  left: number;
  width: number;
  height: number;
  color: string;
  duration: number;
  delay: number;
  shape: 'rect' | 'circle' | 'ribbon';
}

export const CssConfetti: React.FC<{ count?: number }> = ({ count = 55 }) => {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // 0% to 100% width
      width: Math.random() > 0.4 ? Math.floor(Math.random() * 8 + 8) : 6,
      height: Math.random() > 0.6 ? Math.floor(Math.random() * 14 + 10) : 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: Math.random() * 2 + 2.5, // 2.5s to 4.5s
      delay: Math.random() * 1.6, // 0s to 1.6s
      shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.3 ? 'rect' : 'ribbon',
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => {
        const borderRadius =
          piece.shape === 'circle' ? '9999px' : piece.shape === 'ribbon' ? '2px' : '4px';

        return (
          <div
            key={piece.id}
            className="absolute top-0 animate-confetti-fall"
            style={{
              left: `${piece.left}%`,
              width: `${piece.width}px`,
              height: `${piece.height}px`,
              backgroundColor: piece.color,
              borderRadius,
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              transform: `rotate(${Math.floor(Math.random() * 360)}deg)`,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
            }}
          />
        );
      })}
    </div>
  );
};
