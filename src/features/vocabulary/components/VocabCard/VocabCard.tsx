import { FC } from 'react';
import { VocabularyItem, Language } from '@types';
import { JapaneseText } from '@components/JapaneseText';
import { JLPTBadge } from '@components/JLPTBadge';
import { WordTypeBadge } from '@components/WordTypeBadge';
import { useTranslation } from 'react-i18next';
import { Button } from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';
import styles from './VocabCard.module.scss';

export interface VocabCardProps {
  item: VocabularyItem;
  onClick?: (item: VocabularyItem) => void;
  onPlayAudio?: (e: React.MouseEvent, item: VocabularyItem) => void;
}

export const VocabCard: FC<VocabCardProps> = ({ item, onClick, onPlayAudio }) => {
  const { i18n } = useTranslation('common');
  
  // Safely get translation based on current language
  const currentLang = i18n.language as Language;
  const meaning = item.meaning[currentLang] || item.meaning.en;

  return (
    <div className={styles.root} onClick={() => onClick?.(item)}>
      <div className={styles.header}>
        <div style={{ flex: 1 }} />
        {item.audioFile && (
          <Button 
            icon={<Speaker2Regular />} 
            appearance="transparent" 
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio?.(e, item);
            }} 
          />
        )}
      </div>

      <div className={styles.wordContainer}>
        <JapaneseText 
          text={item.kanji || item.hiragana}
          reading={item.kanji ? item.hiragana : undefined}
          romaji={item.romaji}
          showRomaji={true}
          size="xl"
        />
      </div>

      <div className={styles.meaning}>
        {meaning}
      </div>

      <div className={styles.badges}>
        <WordTypeBadge type={item.wordType} size="small" />
        <JLPTBadge level={item.jlptLevel} size="small" />
      </div>
    </div>
  );
};
