import { FC, useEffect, useState } from 'react';
import { KanjiItem, Language, Radical } from '@types';
import { Badge, Button } from '@fluentui/react-components';
import { TextSortAscending24Regular, SearchSquare24Regular, Lightbulb24Regular, Speaker2Regular } from '@fluentui/react-icons';
import { JLPTBadge } from '@components/JLPTBadge';
import { useTranslation } from 'react-i18next';
import { DetailDrawer } from '@components/DetailDrawer';
import { getRadicalByCharacter } from '@data';
import { useAppSelector } from '@store/hooks';
import { JapaneseText } from '@components/JapaneseText';
import { playJapaneseSpeech } from '@utils/audio';
import styles from './KanjiDetail.module.scss';

export interface KanjiDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: KanjiItem | null;
}

export const KanjiDetail: FC<KanjiDetailProps> = ({ isOpen, onClose, item }) => {
  const { t, i18n } = useTranslation(['kanji', 'common']);
  const [radicalDetails, setRadicalDetails] = useState<Radical[]>([]);
  const showFurigana = useAppSelector(state => state.progress.settings.showFurigana);
  const showRomaji = useAppSelector(state => state.progress.settings.showRomaji);

  useEffect(() => {
    if (item?.radicals) {
      Promise.all(item.radicals.map(r => getRadicalByCharacter(r)))
        .then(results => {
          setRadicalDetails(results.filter((r): r is Radical => r !== undefined));
        });
    } else {
      setRadicalDetails([]);
    }
  }, [item]);

  if (!item) return null;

  const currentLang = i18n.language as Language;
  
  return (
    <DetailDrawer isOpen={isOpen} onClose={onClose} title={t('kanji:detail.title')}>
        <div className={styles.root}>
          {/* Hero */}
          <div className={styles.hero}>
            <div className={styles.kanjiBoxWrapper}>
              <div className={styles.kanjiBox}>
                {item.character}
              </div>
              <Button 
                icon={<Speaker2Regular />} 
                appearance="subtle"
                size="small"
                aria-label={t('common:audio.play_pronunciation', { text: item.character })}
                onClick={() => playJapaneseSpeech(item.character)}
              >
                {t('common:audio.play')}
              </Button>
            </div>
            <div className={styles.kanjiInfo}>
              <div className={styles.meaning}>
                {item.meaning[currentLang] || item.meaning.en}
              </div>
              <div>{t('kanji:detail.stroke_count', { count: item.strokeCount })}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <JLPTBadge level={item.jlptLevel} size="large" />
              </div>
            </div>
          </div>

          {/* Mẹo nhớ (Mnemonic) */}
          {item.mnemonic && (item.mnemonic[currentLang] || item.mnemonic.en) && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <Lightbulb24Regular />
                {t('kanji:detail.mnemonic')}
              </div>
              <div className={styles.mnemonicBox}>
                {item.mnemonic[currentLang] || item.mnemonic.en}
              </div>
            </div>
          )}

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
                    {item.onReadings.map((r: string, i: number) => (
                      <Badge 
                        key={i} 
                        color="informative" 
                        className={styles.clickableBadge}
                        onClick={() => playJapaneseSpeech(r)}
                        title={t('common:audio.listen_reading', { text: r })}
                      >
                        {r} <Speaker2Regular style={{ fontSize: '12px', marginLeft: '4px' }} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {item.kunReadings.length > 0 && (
                <div className={styles.readingRow}>
                  <div className={styles.label}>{t('kanji:detail.kun_reading')}</div>
                  <div className={styles.values}>
                    {item.kunReadings.map((r: string, i: number) => (
                      <Badge 
                        key={i} 
                        color="success" 
                        className={styles.clickableBadge}
                        onClick={() => playJapaneseSpeech(r.replace('-', ''))}
                        title={t('common:audio.listen_reading', { text: r })}
                      >
                        {r} <Speaker2Regular style={{ fontSize: '12px', marginLeft: '4px' }} />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bộ thủ */}
          {radicalDetails.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
              <SearchSquare24Regular />
              {t('kanji:detail.radicals')}
            </div>
              <div className={styles.radicalsList}>
                {radicalDetails.map((r: Radical) => {
                  const isPrimary = r.character === item.primaryRadical || r.variants.includes(item.primaryRadical);
                  const radName = r.name[currentLang] || r.name.vi || r.name.en;
                  return (
                    <div key={r.id} className={styles.radicalItem}>
                      <Badge color={isPrimary ? "danger" : "brand"} appearance="outline" size="extra-large">
                        <span className={styles.radicalBadgeText}>{r.character}</span>
                      </Badge>
                      <div className={styles.radicalInfo} style={{ flex: 1 }}>
                        <div className={styles.radicalHeader}>
                          <span className={styles.radicalName}>
                            {radName} ({r.name.ja})
                          </span>
                          {isPrimary && (
                            <Badge color="danger" appearance="filled" size="small">
                              {t('kanji:detail.primary_radical')}
                            </Badge>
                          )}
                        </div>
                        <span className={styles.radicalMeaning}>
                          {r.meaning[currentLang] || r.meaning.en}
                        </span>
                        <div className={styles.radicalDetailsRow}>
                          <span>{t('kanji:detail.stroke_count_short', { count: r.strokeCount })}</span>
                          {r.position && (
                            <span>• {t(`kanji:detail.position.${r.position}`)}</span>
                          )}
                          {r.variants.length > 0 && (
                            <span>• {t('kanji:detail.variants', { variants: r.variants.join(', ') })}</span>
                          )}
                        </div>
                      </div>
                      <Button 
                        icon={<Speaker2Regular />} 
                        appearance="transparent" 
                        size="small"
                        onClick={() => playJapaneseSpeech(r.name.ja || r.character)}
                        aria-label={t('common:audio.play_radical', { text: r.name.ja || r.character })}
                      />
                    </div>
                  );
                })}
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
                      <JapaneseText
                        text={c.word}
                        reading={showFurigana ? c.reading : undefined}
                        showRomaji={showRomaji}
                        size="md"
                      />
                      <Button 
                        icon={<Speaker2Regular />} 
                        appearance="transparent" 
                        size="small"
                        onClick={() => playJapaneseSpeech(c.reading || c.word)}
                        aria-label={t('common:audio.play_compound', { text: c.word })}
                      />
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
