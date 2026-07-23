import { FC } from 'react';
import { Radical, Language } from '@types';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';
import { playJapaneseSpeech } from '@utils/audio';
import styles from './RadicalGrid.module.scss';

export interface RadicalGridProps {
  items: Radical[];
  onItemClick?: (item: Radical) => void;
  onPlayAudio?: (e: React.MouseEvent, item: Radical) => void;
}

export const RadicalGrid: FC<RadicalGridProps> = ({ items, onItemClick, onPlayAudio }) => {
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language as Language;

  // Group radicals by stroke count
  const groupedRadicals = items.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, Radical[]>);

  // Sort groups naturally (e.g. 1画, 2画, ...)
  const sortedGroups = Object.keys(groupedRadicals).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  });

  return (
    <div className={styles.root}>
      {sortedGroups.map(group => (
        <div key={group} className={styles.groupSection}>
          <h3 className={styles.groupTitle}>{group} ({groupedRadicals[group].length})</h3>
          <div className={styles.grid}>
            {groupedRadicals[group].map(item => {
              const localizedName = item.name[currentLang] || item.name.vi || item.name.en;
              return (
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
                    aria-label={t('common:audio.play_radical', { text: item.name.ja || item.character })}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onPlayAudio) {
                        onPlayAudio(e, item);
                      } else {
                        playJapaneseSpeech(item.name.ja || item.character);
                      }
                    }}
                  />
                  <div className={styles.character}>
                    {item.character}
                    {item.variants && item.variants.length > 0 && (
                      <span className={styles.variants}> ({item.variants.join(', ')})</span>
                    )}
                  </div>
                  <div className={styles.meaning}>
                    {item.meaning[currentLang] || item.meaning.en}
                  </div>
                  <div className={styles.name}>
                    {localizedName} / {item.name.ja}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
