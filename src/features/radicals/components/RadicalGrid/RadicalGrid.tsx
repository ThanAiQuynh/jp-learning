import { FC } from 'react';
import { Radical } from '@types';
import { useTranslation } from 'react-i18next';
import { 
  Button, 
  Badge,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
} from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';
import { playJapaneseSpeech } from '@utils/audio';
import { getLocalizedText, getNormalizedLanguage } from '@utils/i18n';
import styles from './RadicalGrid.module.scss';

export interface RadicalGridProps {
  items: Radical[];
  onItemClick?: (item: Radical) => void;
  onPlayAudio?: (e: React.MouseEvent, item: Radical) => void;
}

export const RadicalGrid: FC<RadicalGridProps> = ({ items, onItemClick, onPlayAudio }) => {
  const { t, i18n } = useTranslation(['common', 'kanji']);
  const currentLang = i18n.language;
  const isVi = getNormalizedLanguage(currentLang) === 'vi';

  // Group radicals by stroke count
  const groupedRadicals = items.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, Radical[]>);

  // Sort groups naturally (e.g. 1画, 2画, ...)
  const sortedGroups = Object.keys(groupedRadicals).sort((a, b) => {
    const numA = parseInt(a, 10);
    const numB = parseInt(b, 10);
    return numA - numB;
  });

  const getGroupTitle = (group: string) => {
    const strokeNum = parseInt(group, 10);
    if (!isNaN(strokeNum)) {
      return isVi ? `${strokeNum} nét` : `${strokeNum} ${strokeNum === 1 ? 'stroke' : 'strokes'}`;
    }
    return group;
  };

  const renderAudioButton = (item: Radical) => {
    const readings = (item.name.ja || item.character)
      .split('/')
      .map(r => r.trim())
      .filter(Boolean);

    if (readings.length <= 1) {
      return (
        <Button
          icon={<Speaker2Regular />}
          appearance="transparent"
          size="small"
          className={styles.audioBtn}
          aria-label={t('common:audio.play_radical', { text: readings[0] || item.character })}
          onClick={(e) => {
            e.stopPropagation();
            if (onPlayAudio) {
              onPlayAudio(e, item);
            } else {
              playJapaneseSpeech(readings[0] || item.character);
            }
          }}
        />
      );
    }

    return (
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            icon={<Speaker2Regular />}
            appearance="transparent"
            size="small"
            className={styles.audioBtn}
            aria-label={t('common:audio.play_radical', { text: item.name.ja })}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuTrigger>
        <MenuPopover onClick={(e) => e.stopPropagation()}>
          <MenuList style={{ minWidth: '140px' }}>
            {readings.map((reading, idx) => (
              <MenuItem 
                key={idx}
                icon={<Speaker2Regular />}
                onClick={(e) => {
                  e.stopPropagation();
                  playJapaneseSpeech(reading);
                }}
              >
                {reading}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    );
  };

  return (
    <div className={styles.root}>
      {sortedGroups.map(group => (
        <div key={group} className={styles.groupSection}>
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>{getGroupTitle(group)}</h3>
            <Badge appearance="tint" color="informative">{groupedRadicals[group].length}</Badge>
          </div>
          <div className={styles.grid}>
            {groupedRadicals[group].map(item => {
              const localizedName = getLocalizedText(item.name, currentLang);
              const localizedMeaning = getLocalizedText(item.meaning, currentLang);
              return (
                <div 
                  key={item.id} 
                  className={styles.card}
                  onClick={() => onItemClick?.(item)}
                >
                  {renderAudioButton(item)}
                  <div className={styles.characterContainer}>
                    <span className={styles.mainChar}>{item.character}</span>
                    {item.variants && item.variants.length > 0 && (
                      <span className={styles.variantText}>({item.variants.join(', ')})</span>
                    )}
                  </div>
                  <div className={styles.meaning} title={localizedMeaning}>
                    {localizedMeaning}
                  </div>
                  <div className={styles.name} title={`${localizedName} / ${item.name.ja}`}>
                    {localizedName} ({item.name.ja})
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
