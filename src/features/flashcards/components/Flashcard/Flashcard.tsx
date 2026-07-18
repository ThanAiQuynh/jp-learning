import { FC } from 'react';
import styles from './Flashcard.module.scss';
import { Button } from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';

export interface FlashcardProps {
  front: { text: string; subtext?: string };
  back: { text: string; subtext?: string };
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard: FC<FlashcardProps> = ({ front, back, isFlipped, onFlip }) => {
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
            <Button icon={<Speaker2Regular />} appearance="subtle" size="large" />
          </div>
        </div>

        {/* Back Face */}
        <div className={`${styles.face} ${styles.back}`}>
          <div className={styles.content}>
            <div className={styles.text}>{back.text}</div>
            {back.subtext && <div className={styles.subtext}>{back.subtext}</div>}
          </div>
          <div className={styles.actions} onClick={e => e.stopPropagation()}>
            <Button icon={<Speaker2Regular />} appearance="subtle" size="large" />
          </div>
        </div>

      </div>
    </div>
  );
};
