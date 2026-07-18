import { FC, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Text } from '@fluentui/react-components';
import { ChevronRight16Regular } from '@fluentui/react-icons';

export interface BreadcrumbItemProps {
  label: string;
  path?: string;
}

export interface AppBreadcrumbProps {
  items: BreadcrumbItemProps[];
}

export const AppBreadcrumb: FC<AppBreadcrumbProps> = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <Fragment key={index}>
            {isLast ? (
              <Text weight="bold" style={{ color: 'var(--colorNeutralForeground1)' }}>
                {item.label}
              </Text>
            ) : (
              <Link 
                as="button" 
                onClick={() => item.path && navigate(item.path)} 
                style={{ cursor: 'pointer', color: 'var(--colorNeutralForeground3)' }}
              >
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight16Regular style={{ color: 'var(--colorNeutralForeground4)', fontSize: 14 }} />}
          </Fragment>
        );
      })}
    </div>
  );
};
