import { FC } from 'react';
import { Radical } from '@types';
import { Badge, Button } from '@fluentui/react-components';
import { DocumentText24Regular, SearchSquare24Regular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { DetailDrawer } from '@components/DetailDrawer';
import { getLocalizedText } from '@utils/i18n';
import { RadicalAudioButton } from '../RadicalGrid/RadicalGrid';
import { playJapaneseSpeech } from '@utils/audio';
import styles from './RadicalDetail.module.scss';

export interface RadicalDetailProps {
  isOpen: boolean;
  onClose: () => void;
  item: Radical | null;
}

export const RadicalDetail: FC<RadicalDetailProps> = ({ isOpen, onClose, item }) => {
  const { t, i18n } = useTranslation(['kanji', 'common']);

  const currentLang = i18n.language;
  const localizedName = item ? getLocalizedText(item.name, currentLang) : '';
  const localizedMeaning = item ? getLocalizedText(item.meaning, currentLang) : '';

  return (
    <DetailDrawer isOpen={isOpen && !!item} onClose={onClose} title={t('common:navigation.radicals')}>
      {item && (
        <div className={styles.root}>
          {/* Hero Section */}
          <div className={styles.hero}>
            <div className={styles.charBoxWrapper}>
              <div className={styles.charBox} lang="ja">
                {item.character}
              </div>
              <RadicalAudioButton item={item} />
            </div>
            <div className={styles.info}>
              <div className={styles.titleGroup}>
                <span className={styles.name}>{localizedName}</span>
                {item.name?.ja && <span className={styles.jaName} lang="ja">({item.name.ja})</span>}
              </div>
              <div className={styles.meaning}>{localizedMeaning}</div>
              
              <div className={styles.badges}>
                <Badge color="brand" appearance="filled" size="large">
                  #{item.number}
                </Badge>
                <Badge color="subtle" appearance="tint" size="large">
                  {t('kanji:detail.stroke_count_short', { count: item.strokeCount })}
                </Badge>
                {item.position && (
                  <Badge color="informative" appearance="tint" size="large">
                    {t(`kanji:detail.position.${item.position}`, { defaultValue: item.position })}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Variants section */}
          {item.variants && item.variants.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <DocumentText24Regular className={styles.sectionIcon} />
                {t('kanji:detail.variants_title', { defaultValue: 'Biến thể' })}
              </div>
              <div className={styles.variantsBox}>
                {item.variants.map((v, idx) => (
                  <Badge key={idx} color="subtle" appearance="tint" size="extra-large" lang="ja">
                    {v}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Kanji List section */}
          {item.kanjiList && item.kanjiList.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <SearchSquare24Regular className={styles.sectionIcon} />
                {t('kanji:detail.containing_kanji', { count: item.kanjiList.length, defaultValue: `Kanji chứa bộ thủ này (${item.kanjiList.length})` })}
              </div>
              <div className={styles.kanjiGrid}>
                {item.kanjiList.map((kanji, idx) => (
                  <Button 
                    key={idx} 
                    appearance="outline" 
                    size="large"
                    className={styles.kanjiBtn}
                    onClick={() => playJapaneseSpeech(kanji)}
                    aria-label={t('common:audio.listen_reading', { text: kanji, defaultValue: `Nghe ${kanji}` })}
                    title={t('common:audio.listen_reading', { text: kanji, defaultValue: `Nghe ${kanji}` })}
                    lang="ja"
                  >
                    {kanji}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DetailDrawer>
  );
};
