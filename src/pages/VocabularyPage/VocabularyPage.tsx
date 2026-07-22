import { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { VocabularyItem } from '@types';
import { VocabList } from '@features/vocabulary/components/VocabList';
import { SearchBox, Button } from '@fluentui/react-components';
import { FilterRegular } from '@fluentui/react-icons';
import { VocabDetail } from '@features/vocabulary/components/VocabDetail';
import { PageHeader } from '@components/PageHeader';
import { getVocabForLesson } from '@data/index';
import { playJapaneseSpeech } from '@utils/audio';
import { useDebounce } from '@utils/useDebounce';

import styles from './VocabularyPage.module.scss';

export const VocabularyPage: FC = () => {
  const { t } = useTranslation('vocabulary');
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getVocabForLesson(lessonId).then(data => setVocabData(data));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lessonId]);

  const filteredData = vocabData.filter(v => {
    if (!debouncedSearchQuery) return true;
    const q = debouncedSearchQuery.toLowerCase();
    return v.hiragana.toLowerCase().includes(q) ||
           (v.kanji && v.kanji.toLowerCase().includes(q)) ||
           (v.romaji && v.romaji.toLowerCase().includes(q)) ||
           (v.meaning.vi && v.meaning.vi.toLowerCase().includes(q)) ||
           (v.meaning.en && v.meaning.en.toLowerCase().includes(q));
  });

  const handleItemClick = (item: VocabularyItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className={styles.root}>
      <PageHeader 
        title={t('title', { lesson: lessonId.replace('lesson-', '') })}
        subtitle={t('subtitle') as string}
      />

      <div className={styles.filterBar}>
        <SearchBox 
          placeholder={t('common.search', 'Search...')} 
          aria-label={t('common.search', 'Search...')}
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value || '')}
          className={styles.searchBox}
        />
        <Button icon={<FilterRegular />} aria-label="Filter" />
      </div>

      <VocabList 
        items={filteredData} 
        onItemClick={handleItemClick}
        onPlayAudio={(item) => playJapaneseSpeech(item.hiragana || item.kanji)}
      />

      <VocabDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
