import { FC } from 'react';
import { KanjiItem, Language } from '@types';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';
import { playJapaneseSpeech } from '@utils/audio';
import styles from './KanjiGrid.module.scss';

export interface KanjiGridProps {
  items: KanjiItem[];
  onItemClick?: (item: KanjiItem) => void;
  onPlayAudio?: (e: React.MouseEvent, item: KanjiItem) => void;
}

export const KanjiGrid: FC<KanjiGridProps> = ({ items, onItemClick, onPlayAudio }) => {
  const { t, i18n } = useTranslation('common');
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
              {item.meaning[currentLang] || item.meaning.en}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
