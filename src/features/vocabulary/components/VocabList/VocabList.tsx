import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { VocabularyItem } from '@types';
import { VocabCard } from '../VocabCard';
import styles from './VocabList.module.scss';

export interface VocabListProps {
  items: VocabularyItem[];
  onItemClick?: (item: VocabularyItem) => void;
  onPlayAudio?: (item: VocabularyItem) => void;
}

export const VocabList: FC<VocabListProps> = ({ items, onItemClick, onPlayAudio }) => {
  const { t } = useTranslation('common');
  if (!items || items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{t('common.no_data')}</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {items.map(item => (
          <VocabCard 
            key={item.id} 
            item={item} 
            onClick={onItemClick}
            onPlayAudio={(_e, it) => onPlayAudio?.(it)}
          />
        ))}
      </div>
    </div>
  );
};
