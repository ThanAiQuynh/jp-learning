import { FC, useEffect } from 'react';
import { Button, Tooltip } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import styles from './FlashcardControls.module.scss';

export interface FlashcardControlsProps {
  isFlipped: boolean;
  onFlip: () => void;
  onRate: (rating: 'again' | 'hard' | 'good' | 'easy') => void;
}

export const FlashcardControls: FC<FlashcardControlsProps> = ({ isFlipped, onFlip, onRate }) => {
  const { t } = useTranslation('flashcard');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        onFlip();
      }

      if (isFlipped) {
        switch (e.key) {
          case '1': onRate('again'); break;
          case '2': onRate('hard'); break;
          case '3': onRate('good'); break;
          case '4': onRate('easy'); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onFlip, onRate]);

  return (
    <div className={styles.root}>
      {!isFlipped ? (
        <Button appearance="primary" size="large" onClick={onFlip} className={styles.flipBtn}>
          {t('flip')}
        </Button>
      ) : (
        <div className={styles.ratings}>
          <Tooltip content="Shortcut: 1" relationship="label">
            <Button appearance="outline" size="large" className={styles.again} onClick={() => onRate('again')}>
              {t('again')}
            </Button>
          </Tooltip>
          <Tooltip content="Shortcut: 2" relationship="label">
            <Button appearance="outline" size="large" className={styles.hard} onClick={() => onRate('hard')}>
              {t('hard')}
            </Button>
          </Tooltip>
          <Tooltip content="Shortcut: 3" relationship="label">
            <Button appearance="outline" size="large" className={styles.good} onClick={() => onRate('good')}>
              {t('good')}
            </Button>
          </Tooltip>
          <Tooltip content="Shortcut: 4" relationship="label">
            <Button appearance="outline" size="large" className={styles.easy} onClick={() => onRate('easy')}>
              {t('easy')}
            </Button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};


