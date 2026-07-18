import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearchParams } from 'react-router-dom';

import { VocabularyItem } from '@types';
import { VocabList } from '@features/vocabulary/components/VocabList';
import { SearchBox, Button } from '@fluentui/react-components';
import { FilterRegular } from '@fluentui/react-icons';
import { VocabDetail } from '@features/vocabulary/components/VocabDetail';
import { PageHeader } from '@components/PageHeader';
import { getVocabForLesson } from '@data/index';

export const VocabularyPage: FC = () => {
  const { t } = useTranslation('vocabulary');
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getVocabForLesson(lessonId).then(data => setVocabData(data));
  }, [lessonId]);

  const filteredData = vocabData.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
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
    // Don't clear selected item immediately to allow close animation
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div style={{ padding: '0 16px' }}>
      <PageHeader 
        title={t('title', { lesson: lessonId.replace('lesson-', '') })}
        subtitle={t('subtitle') as string}
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <SearchBox 
          placeholder={t('common.search', 'Search...')} 
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value || '')}
          style={{ flex: 1 }}
        />
        <Button icon={<FilterRegular />} aria-label="Filter" />
      </div>

      <VocabList 
        items={filteredData} 
        onItemClick={handleItemClick}
        onPlayAudio={(item) => console.log('Play audio for', item.id)}
      />

      <VocabDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
