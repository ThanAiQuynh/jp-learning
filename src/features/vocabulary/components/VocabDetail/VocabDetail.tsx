import { FC } from 'react';
import { VocabularyItem, Language } from '@types';
import { Button } from '@fluentui/react-components';
import { BookOpen24Regular, Speaker2Regular } from '@fluentui/react-icons';
import { JapaneseText } from '@components/JapaneseText';
import { JLPTBadge } from '@components/JLPTBadge';
import { WordTypeBadge } from '@components/WordTypeBadge';
import { useTranslation } from 'react-i18next';
import { DetailDrawer } from '@components/DetailDrawer';
import { useAppSelector } from '@store/hooks';
import { playJapaneseSpeech } from '@utils/audio';
import styles from './VocabDetail.module.scss';

export interface VocabDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: VocabularyItem | null;
}

export const VocabDetail: FC<VocabDetailProps> = ({ isOpen, onClose, item }) => {
  const { t, i18n } = useTranslation(['vocabulary', 'common']);
  const showRomaji = useAppSelector(state => state.progress.settings.showRomaji);
  const showFurigana = useAppSelector(state => state.progress.settings.showFurigana);

  if (!item) return null;

  const currentLang = i18n.language as Language;
  const wordText = item.kanji || item.hiragana;

  return (
    <DetailDrawer isOpen={isOpen} onClose={onClose} title={t('vocabulary:detail.title')}>
        <div className={styles.root}>
          {/* Hero Section */}
          <div className={styles.wordHero}>
            <JapaneseText
              text={wordText}
              reading={showFurigana && item.kanji ? item.hiragana : undefined}
              romaji={item.romaji}
              showRomaji={showRomaji}
              size="xxl"
            />
            <div className={styles.badges}>
              <WordTypeBadge type={item.wordType} size="large" />
              <JLPTBadge level={item.jlptLevel} size="large" />
              <Button 
                icon={<Speaker2Regular />} 
                appearance="outline"
                size="medium"
                onClick={() => playJapaneseSpeech(item.hiragana || wordText)}
              >
                {t('vocabulary:detail.listen', 'Nghe phát âm')}
              </Button>
            </div>
          </div>

          {/* Meaning Section */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <BookOpen24Regular />
              {t('vocabulary:detail.meaning')}
            </div>
            <div>
              {item.meaning.vi && <p><strong>VI:</strong> {item.meaning.vi}</p>}
              {item.meaning.en && <p><strong>EN:</strong> {item.meaning.en}</p>}
            </div>
          </div>

          {/* Examples Section */}
          {item.examples && item.examples.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>📝 {t('vocabulary:detail.examples')}</div>
              {item.examples.map((ex: any, idx: number) => (
                <div 
                  key={idx} 
                  className={styles.example}
                  onClick={() => playJapaneseSpeech(ex.reading || ex.ja)}
                  style={{ cursor: 'pointer' }}
                  title="Click to listen"
                >
                  <div className={styles.ja} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{ex.ja}</span>
                    <Speaker2Regular style={{ fontSize: '14px', opacity: 0.7 }} />
                  </div>
                  <div className={styles.reading}>{ex.reading}</div>
                  <div className={styles.translation}>{ex.translation[currentLang] || ex.translation.en}</div>
                </div>
              ))}
            </div>
          )}

          {/* Related Kanji Section */}
          {item.relatedKanji && item.relatedKanji.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>🈁 {t('vocabulary:detail.related_kanji')}</div>
              <div className={styles.kanjiLinks}>
                {item.relatedKanji.map((kanji: string, idx: number) => (
                  <Button key={idx} appearance="secondary">{kanji}</Button>
                ))}
              </div>
            </div>
          )}
        </div>
    </DetailDrawer>
  );
};
