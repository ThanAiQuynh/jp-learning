import { FC } from 'react';
import { GrammarPattern } from '@types';
import { Info24Regular, Wrench24Regular, CommentMultiple24Regular, Speaker2Regular } from '@fluentui/react-icons';
import { Button } from '@fluentui/react-components';
import { JLPTBadge } from '@components/JLPTBadge';
import { useTranslation } from 'react-i18next';
import { DetailDrawer } from '@components/DetailDrawer';
import { playJapaneseSpeech } from '@utils/audio';
import { getLocalizedText, getNormalizedLanguage } from '@utils/i18n';
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

  const currentLang = i18n.language;
  const normalizedLang = getNormalizedLanguage(currentLang);
  const usageText = getLocalizedText(item.usage, currentLang);
  
  return (
    <DetailDrawer isOpen={isOpen} onClose={onClose} title={t('grammar:detail.title')}>
      <div className={styles.root}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.pattern}>{formatGrammarPattern(item.pattern, normalizedLang)}</div>
          <div className={styles.title}>{getLocalizedText(item.title, currentLang)}</div>
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
          <p>{getLocalizedText(item.explanation, currentLang)}</p>
          {usageText && (
            <p style={{ marginTop: '8px', fontStyle: 'italic', color: 'var(--colorNeutralForeground2)' }}>
              * {t('grammar:detail.usage', { usage: usageText })}
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
                <li key={idx}>{formatGrammarPattern(form, normalizedLang)}</li>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div className={styles.ja}>{ex.ja}</div>
                  <Button
                    icon={<Speaker2Regular />}
                    appearance="subtle"
                    size="small"
                    aria-label={t('common:audio.play_pronunciation', { text: ex.ja })}
                    onClick={() => playJapaneseSpeech(ex.ja)}
                  />
                </div>
                <div className={styles.reading}>{ex.reading}</div>
                <div className={styles.translation}>{getLocalizedText(ex.translation, currentLang)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DetailDrawer>
  );
};
