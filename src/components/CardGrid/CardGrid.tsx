import { FC, ReactNode } from 'react';

export interface CardGridProps {
  children: ReactNode;
  minWidth?: number;
}

export const CardGrid: FC<CardGridProps> = ({ children, minWidth = 250 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`, gap: '16px' }}>
      {children}
    </div>
  );
};
