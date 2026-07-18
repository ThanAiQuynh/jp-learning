import { FC, ReactNode } from 'react';
import { Title1 } from '@fluentui/react-components';
import { AppBreadcrumb, BreadcrumbItemProps } from '@components/AppBreadcrumb';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItemProps[];
  action?: ReactNode;
  marginBottom?: number | string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, subtitle, breadcrumbItems, action, marginBottom = '24px' }) => {
  return (
    <div style={{ marginBottom }}>
      {breadcrumbItems && breadcrumbItems.length > 0 && <AppBreadcrumb items={breadcrumbItems} />}
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          <Title1 style={{ display: 'block' }}>{title}</Title1>
          {subtitle && <div style={{ fontSize: '18px', color: 'var(--colorNeutralForeground2)', marginTop: '4px' }}>{subtitle}</div>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};
