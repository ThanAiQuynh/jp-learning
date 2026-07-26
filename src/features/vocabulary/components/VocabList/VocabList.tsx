import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { VocabularyItem } from '@types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useContainerWidth } from '@utils/useContainerWidth';
import { VocabCard } from '../VocabCard';
import styles from './VocabList.module.scss';

export interface VocabListProps {
  items: VocabularyItem[];
  onItemClick?: (item: VocabularyItem) => void;
  onPlayAudio?: (item: VocabularyItem) => void;
}

export const VocabList: FC<VocabListProps> = ({ items, onItemClick, onPlayAudio }) => {
  const { t } = useTranslation('common');
  const parentRef = useRef<HTMLDivElement>(null);

  const containerWidth = useContainerWidth(parentRef);
  const minCardWidth = 240;
  const gap = 16;
  const cols = containerWidth > 0 ? Math.max(1, Math.floor((containerWidth + gap) / (minCardWidth + gap))) : 3;
  const totalRows = Math.ceil((items || []).length / cols);

  const virtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 3,
  });

  if (!items || items.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>{t('common.no_data')}</p>
      </div>
    );
  }

  return (
    <div ref={parentRef} className={styles.scrollContainer}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = items.slice(virtualRow.index * cols, (virtualRow.index + 1) * cols);

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div 
                className={styles.rowGrid}
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
              >
                {rowItems.map((item) => (
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
        })}
      </div>
    </div>
  );
};
