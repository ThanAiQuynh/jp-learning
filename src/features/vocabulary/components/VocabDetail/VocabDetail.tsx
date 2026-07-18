import { FC } from 'react';
import { VocabularyItem, Language } from '@types';
import { Button } from '@fluentui/react-components';
import { BookOpen24Regular, Speaker2Regular } from '@fluentui/react-icons';
import { JapaneseText } from '@components/JapaneseText';
import { JLPTBadge } from '@components/JLPTBadge';
import { WordTypeBadge } from '@components/WordTypeBadge';
import { useTranslation } from 'react-i18next';
import { DetailDrawer } from '@components/DetailDrawer';
import styles from './VocabDetail.module.scss';

export interface VocabDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: VocabularyItem | null;
}

export const VocabDetail: FC<VocabDetailProps> = ({ isOpen, onClose, item }) => {
  const { t, i18n } = useTranslation(['vocabulary', 'common']);

  if (!item) return null;

  const currentLang = i18n.language as Language;

  return (
    <DetailDrawer isOpen={isOpen} onClose={onClose} title={t('vocabulary:detail.title')}>
        <div className={styles.root}>
          {/* Hero Section */}
          <div className={styles.wordHero}>
            <JapaneseText
              text={item.kanji || item.hiragana}
              reading={item.kanji ? item.hiragana : undefined}
              romaji={item.romaji}
              showRomaji={true}
              size="xxl"
            />
            <div className={styles.badges}>
              <WordTypeBadge type={item.wordType} />
              <JLPTBadge level={item.jlptLevel} />
              {item.audioFile && (
                <Button icon={<Speaker2Regular />} appearance="outline">{t('vocabulary:detail.listen')}</Button>
              )}
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
                <div key={idx} className={styles.example}>
                  <div className={styles.ja}>{ex.ja}</div>
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
