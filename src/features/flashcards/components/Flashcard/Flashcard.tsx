import { FC, MouseEvent } from 'react';
import styles from './Flashcard.module.scss';
import { Button, Tooltip } from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';
import { playJapaneseSpeech } from '@utils/audio';
import { useTranslation } from 'react-i18next';

export interface FlashcardFace {
  text: string;
  subtext?: string;
  audioText?: string;
}

export interface FlashcardProps {
  front: FlashcardFace;
  back: FlashcardFace;
  isFlipped: boolean;
  onFlip: () => void;
  onPlayAudio?: (text: string) => void;
}

export const Flashcard: FC<FlashcardProps> = ({ front, back, isFlipped, onFlip, onPlayAudio }) => {
  const { t } = useTranslation('flashcard');

  const handleAudioClick = (e: MouseEvent, face: FlashcardFace) => {
    e.stopPropagation();
    const textToPlay = face.audioText || face.subtext || face.text;
    if (!textToPlay) return;

    if (onPlayAudio) {
      onPlayAudio(textToPlay);
    } else {
      playJapaneseSpeech(textToPlay);
    }
  };

  return (
    <div className={styles.scene} onClick={onFlip}>
      <div className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}>
        
        {/* Front Face */}
        <div className={`${styles.face} ${styles.front}`}>
          <div className={styles.content}>
            <div className={styles.text}>{front.text}</div>
            {front.subtext && <div className={styles.subtext}>{front.subtext}</div>}
          </div>
          <div className={styles.actions} onClick={e => e.stopPropagation()}>
            <Tooltip content={t('listen', 'Nghe phát âm')} relationship="label">
              <Button
                icon={<Speaker2Regular />}
                appearance="subtle"
                size="large"
                onClick={(e) => handleAudioClick(e, front)}
                aria-label={t('listen', 'Nghe phát âm')}
              />
            </Tooltip>
          </div>
        </div>

        {/* Back Face */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.content}>
            <div className={styles.text}>{back.text}</div>
            {back.subtext && <div className={styles.subtext}>{back.subtext}</div>}
          </div>
          <div className={styles.actions} onClick={e => e.stopPropagation()}>
            <Tooltip content={t('listen', 'Nghe phát âm')} relationship="label">
              <Button
                icon={<Speaker2Regular />}
                appearance="subtle"
                size="large"
                onClick={(e) => handleAudioClick(e, back)}
                aria-label={t('listen', 'Nghe phát âm')}
              />
            </Tooltip>
          </div>
        </div>

      </div>
    </div>
  );
};

