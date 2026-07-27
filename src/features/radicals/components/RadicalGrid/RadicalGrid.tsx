import { FC, useState } from 'react';
import { Radical } from '@types';
import { useTranslation } from 'react-i18next';
import { 
  Button, 
  Badge,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import { Speaker2Regular } from '@fluentui/react-icons';
import { playJapaneseSpeech } from '@utils/audio';
import { getLocalizedText, getNormalizedLanguage } from '@utils/i18n';
import styles from './RadicalGrid.module.scss';

export interface RadicalAudioButtonProps {
  item: Radical;
  className?: string;
  onPlayAudio?: (e: React.MouseEvent, item: Radical) => void;
}

export const RadicalAudioButton: FC<RadicalAudioButtonProps> = ({ item, className, onPlayAudio }) => {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  if (!item) return null;

  const readings = (item.name?.ja || item.character || '')
    .split('/')
    .map(r => r.trim())
    .filter(Boolean);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (readings.length <= 1) {
    return (
      <div onClick={handleContainerClick} style={{ display: 'inline-flex' }}>
        <Button
          icon={<Speaker2Regular />}
          appearance="transparent"
          size="small"
          className={className}
          aria-label={t('common:audio.play_radical', { text: readings[0] || item.character, defaultValue: `Nghe ${readings[0] || item.character}` })}
          onClick={(e) => {
            e.stopPropagation();
            if (onPlayAudio) {
              onPlayAudio(e, item);
            } else {
              playJapaneseSpeech(readings[0] || item.character);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div onClick={handleContainerClick} style={{ display: 'inline-flex' }}>
      <Popover 
        open={open} 
        onOpenChange={(_, data) => setOpen(data.open)}
        withArrow 
        positioning="above"
      >
        <PopoverTrigger disableButtonEnhancement>
          <Button
            icon={<Speaker2Regular />}
            appearance="transparent"
            size="small"
            className={className}
            aria-label={t('common:audio.play_radical', { text: item.name?.ja || item.character, defaultValue: `Nghe ${item.name?.ja || item.character}` })}
          />
        </PopoverTrigger>
        <PopoverSurface 
          onClick={(e) => e.stopPropagation()} 
          style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '130px' }}
        >
          {readings.map((reading, idx) => (
            <Button
              key={idx}
              icon={<Speaker2Regular />}
              appearance="subtle"
              size="small"
              style={{ justifyContent: 'flex-start', width: '100%' }}
              onClick={(e) => {
                e.stopPropagation();
                playJapaneseSpeech(reading);
                setOpen(false);
              }}
            >
              {reading}
            </Button>
          ))}
        </PopoverSurface>
      </Popover>
    </div>
  );
};

export interface RadicalGridProps {
  items: Radical[];
  onItemClick?: (item: Radical) => void;
  onPlayAudio?: (e: React.MouseEvent, item: Radical) => void;
}

export const RadicalGrid: FC<RadicalGridProps> = ({ items, onItemClick, onPlayAudio }) => {
  const { i18n } = useTranslation(['common', 'kanji']);
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
                  <RadicalAudioButton 
                    item={item} 
                    className={styles.audioBtn} 
                    onPlayAudio={onPlayAudio} 
                  />
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
