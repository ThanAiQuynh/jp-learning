import { FC } from 'react';
import { GrammarPattern, Language } from '@types';
import { Info24Regular, Wrench24Regular, CommentMultiple24Regular } from '@fluentui/react-icons';
import { JLPTBadge } from '@components/JLPTBadge';
import { useTranslation } from 'react-i18next';
import { DetailDrawer } from '@components/DetailDrawer';
import styles from './GrammarDetail.module.scss';
import { formatGrammarPattern } from '../../utils';

export interface GrammarDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: GrammarPattern | null;
}

export const GrammarDetail: FC<GrammarDetailProps> = ({ isOpen, onClose, item }) => {
  const { t, i18n } = useTranslation(['grammar', 'common']);

  if (!item) return null;

  const currentLang = i18n.language as Language;
  
  return (
    <DetailDrawer isOpen={isOpen} onClose={onClose} title={t('grammar:detail.title')}>
        <div className={styles.root}>
          {/* Hero */}
          <div className={styles.hero}>
            <div className={styles.pattern}>{formatGrammarPattern(item.pattern, currentLang)}</div>
            <div className={styles.title}>{item.title[currentLang] || item.title.en}</div>
            <div style={{ marginTop: '12px' }}>
              <JLPTBadge level={item.jlptLevel} size="large" />
            </div>
          </div>

          {/* Explanation */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <Info24Regular />
              {t('grammar:detail.explanation')}
            </div>
            <p>{item.explanation[currentLang] || item.explanation.en}</p>
            {item.usage && (
              <p style={{ marginTop: '8px', fontStyle: 'italic', color: 'var(--colorNeutralForeground2)' }}>
                * {t('grammar:detail.usage', { usage: item.usage[currentLang] || item.usage.en })}
              </p>
            )}
          </div>

          {/* Formation */}
          {item.formation && item.formation.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
              <Wrench24Regular />
              {t('grammar:detail.formation')}
            </div>
              <ul className={styles.formationList}>
                {item.formation.map((form: string, idx: number) => (
                  <li key={idx}>{formatGrammarPattern(form, currentLang)}</li>
                ))}
              </ul>
            </div>
          )}


          {/* Examples */}
          {item.examples && item.examples.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
              <CommentMultiple24Regular />
              {t('grammar:detail.examples')}
            </div>
              {item.examples.map((ex: any, idx: number) => (
                <div key={idx} className={styles.example}>
                  {/* TODO: Implement highlight based on ex.highlightRange if needed */}
                  <div className={styles.ja}>{ex.ja}</div>
                  <div className={styles.reading}>{ex.reading}</div>
                  <div className={styles.translation}>{ex.translation[currentLang] || ex.translation.en}</div>
                </div>
              ))}
            </div>
          )}
        </div>
    </DetailDrawer>
  );
};
