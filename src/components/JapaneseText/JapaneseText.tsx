import { FC } from 'react';
import styles from './JapaneseText.module.scss';
import { mergeClasses } from '@fluentui/react-components';

export interface JapaneseTextProps {
  text: string; // The main text (kanji or kana)
  reading?: string; // The reading (hiragana/katakana) to show as ruby
  romaji?: string; // Romaji reading (optional)
  showFurigana?: boolean;
  showRomaji?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  onClick?: () => void;
}

export const JapaneseText: FC<JapaneseTextProps> = ({
  text,
  reading,
  romaji,
  showFurigana = true,
  showRomaji = false,
  size = 'md',
  className,
  onClick,
}) => {
  return (
    <div 
      className={mergeClasses(styles.root, styles[size], className)} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <ruby className={styles.ruby}>
        {text}
        {showFurigana && reading && (
          <rt className={styles.rt}>{reading}</rt>
        )}
      </ruby>
      
      {showRomaji && romaji && (
        <span className={styles.romaji}>{romaji}</span>
      )}
    </div>
  );
};
