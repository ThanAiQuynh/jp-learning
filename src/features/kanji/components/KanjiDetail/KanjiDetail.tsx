import { FC } from 'react';
import { KanjiItem, Language } from '@types';
import { Badge } from '@fluentui/react-components';
import { TextSortAscending24Regular, SearchSquare24Regular } from '@fluentui/react-icons';
import { JLPTBadge } from '@components/JLPTBadge';
import { useTranslation } from 'react-i18next';
import { DetailDrawer } from '@components/DetailDrawer';
import styles from './KanjiDetail.module.scss';

export interface KanjiDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: KanjiItem | null;
}

export const KanjiDetail: FC<KanjiDetailProps> = ({ isOpen, onClose, item }) => {
  const { t, i18n } = useTranslation(['kanji', 'common']);

  if (!item) return null;

  const currentLang = i18n.language as Language;
  
  return (
    <DetailDrawer isOpen={isOpen} onClose={onClose} title={t('kanji:detail.title')}>
        <div className={styles.root}>
          {/* Hero */}
          <div className={styles.hero}>
            <div className={styles.kanjiBox}>
              {item.character}
            </div>
            <div className={styles.kanjiInfo}>
              <div className={styles.meaning}>
                {item.meaning[currentLang] || item.meaning.en}
              </div>
              <div>{t('kanji:detail.stroke_count', { count: item.strokeCount })}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <JLPTBadge level={item.jlptLevel} />
              </div>
            </div>
          </div>

          {/* Âm đọc */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <TextSortAscending24Regular />
              {t('kanji:detail.readings')}
            </div>
            <div className={styles.readingsBox}>
              {item.onReadings.length > 0 && (
                <div className={styles.readingRow}>
                  <div className={styles.label}>{t('kanji:detail.on_reading')}</div>
                  <div className={styles.values}>
                    {item.onReadings.map((r: string, i: number) => <Badge key={i} color="informative">{r}</Badge>)}
                  </div>
                </div>
              )}
              {item.kunReadings.length > 0 && (
                <div className={styles.readingRow}>
                  <div className={styles.label}>{t('kanji:detail.kun_reading')}</div>
                  <div className={styles.values}>
                    {item.kunReadings.map((r: string, i: number) => <Badge key={i} color="success">{r}</Badge>)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bộ thủ */}
          {item.radicals && item.radicals.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
              <SearchSquare24Regular />
              {t('kanji:detail.radicals')}
            </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {item.radicals.map((r: string, i: number) => (
                  <Badge key={i} color="brand" appearance="outline">{r}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Từ ghép */}
          {item.compounds && item.compounds.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
              <TextSortAscending24Regular />
              {t('kanji:detail.compounds')}
            </div>
              <div className={styles.compoundsList}>
                {item.compounds.map((c: any, i: number) => (
                  <div key={i} className={styles.compoundItem}>
                    <div className={styles.left}>
                      <span className={styles.word}>{c.word}</span>
                      <span className={styles.reading}>{c.reading}</span>
                    </div>
                    <div className={styles.meaning}>
                      {c.meaning[currentLang] || c.meaning.en}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </DetailDrawer>
  );
};
