import { FC } from 'react';
import { Badge } from '@fluentui/react-components';
import { JLPTLevel } from '@types';

export interface JLPTBadgeProps {
  level: JLPTLevel;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

const getBadgeColor = (level: JLPTLevel) => {
  switch (level) {
    case 'N5': return 'brand';
    case 'N4': return 'success';
    case 'N3': return 'warning';
    case 'N2': return 'danger';
    case 'N1': return 'severe';
    default: return 'brand';
  }
};

export const JLPTBadge: FC<JLPTBadgeProps> = ({ level, size = 'medium' }) => {
  return (
    <Badge color={getBadgeColor(level)} size={size} shape="rounded">
      {level}
    </Badge>
  );
};
