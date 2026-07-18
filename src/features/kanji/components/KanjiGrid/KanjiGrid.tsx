import { FC } from 'react';
import { KanjiItem, Language } from '@types';
import { useTranslation } from 'react-i18next';
import styles from './KanjiGrid.module.scss';

export interface KanjiGridProps {
  items: KanjiItem[];
  onItemClick?: (item: KanjiItem) => void;
}

export const KanjiGrid: FC<KanjiGridProps> = ({ items, onItemClick }) => {
  const { i18n } = useTranslation('common');
  const currentLang = i18n.language as Language;

  return (
    <div className={styles.root}>
      <div className={styles.grid}>
        {items.map(item => (
          <div 
            key={item.id} 
            className={styles.card}
            onClick={() => onItemClick?.(item)}
          >
            <div className={styles.character}>{item.character}</div>
            <div className={styles.meaning}>
              {item.meaning[currentLang] || item.meaning.en}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
