import { FC } from 'react';
import { Badge } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { WordType } from '@types';

export interface WordTypeBadgeProps {
  type: WordType;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
}

const getWordTypeColor = (type: WordType) => {
  if (type === 'noun') return 'brand';
  if (type.includes('verb')) return 'danger';
  if (type.includes('adjective')) return 'warning';
  if (type === 'particle') return 'success';
  return 'informative';
};

export const WordTypeBadge: FC<WordTypeBadgeProps> = ({ type, size = 'medium' }) => {
  const { t } = useTranslation('common');

  return (
    <Badge color={getWordTypeColor(type)} size={size} shape="rounded" appearance="outline">
      {t(`word_type.${type}`, { defaultValue: type })}
    </Badge>
  );
};
