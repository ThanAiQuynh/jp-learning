import { FC, ReactNode } from 'react';
import { Title3, Body1 } from '@fluentui/react-components';

export interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: FC<EmptyStateProps> = ({ title, message, icon, action }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', color: 'var(--colorNeutralForeground3)' }}>
      {icon && <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>}
      {title && <Title3 style={{ marginBottom: 8 }}>{title}</Title3>}
      <Body1 style={{ marginBottom: action ? 24 : 0 }}>{message}</Body1>
      {action}
    </div>
  );
};
