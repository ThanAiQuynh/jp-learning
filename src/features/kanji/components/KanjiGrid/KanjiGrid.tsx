import { FC, useRef } from 'react';
import { KanjiItem } from '@types';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';
import { playJapaneseSpeech } from '@utils/audio';
import { getLocalizedText } from '@utils/i18n';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useContainerWidth } from '@utils/useContainerWidth';
import styles from './KanjiGrid.module.scss';

export interface KanjiGridProps {
  items: KanjiItem[];
  onItemClick?: (item: KanjiItem) => void;
  onPlayAudio?: (e: React.MouseEvent, item: KanjiItem) => void;
}

export const KanjiGrid: FC<KanjiGridProps> = ({ items, onItemClick, onPlayAudio }) => {
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language;
  const parentRef = useRef<HTMLDivElement>(null);

  const containerWidth = useContainerWidth(parentRef);
  const minCardWidth = 110;
  const gap = 16;
  const cols = containerWidth > 0 ? Math.max(1, Math.floor((containerWidth + gap) / (minCardWidth + gap))) : 4;
  const totalRows = Math.ceil(items.length / cols);

  const virtualizer = useVirtualizer({
    count: totalRows,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    overscan: 3,
  });

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
                  <div 
                    key={item.id} 
                    className={styles.card}
                    onClick={() => onItemClick?.(item)}
                  >
                    <Button
                      icon={<Speaker2Regular />}
                      appearance="transparent"
                      size="small"
                      className={styles.audioBtn}
                      aria-label={t('common:audio.play_pronunciation', { text: item.character })}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPlayAudio) {
                          onPlayAudio(e, item);
                        } else {
                          playJapaneseSpeech(item.character);
                        }
                      }}
                    />
                    <div className={styles.character}>{item.character}</div>
                    <div className={styles.meaning}>
                      {getLocalizedText(item.meaning, currentLang)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
