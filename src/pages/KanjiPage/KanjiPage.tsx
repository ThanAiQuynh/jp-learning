import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearchParams } from 'react-router-dom';

import { KanjiItem } from '@types';
import { KanjiGrid } from '@features/kanji/components/KanjiGrid';
import { SearchBox, Button } from '@fluentui/react-components';
import { FilterRegular } from '@fluentui/react-icons';
import { KanjiDetail } from '@features/kanji/components/KanjiDetail';
import { PageHeader } from '@components/PageHeader';
import { getKanjiForLesson } from '@data/index';

export const KanjiPage: FC = () => {
  const { t } = useTranslation('kanji');
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KanjiItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getKanjiForLesson(lessonId).then(data => setKanjiData(data));
  }, [lessonId]);

  const filteredData = kanjiData.filter(k => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return k.character.toLowerCase().includes(q) ||
           (k.meaning.vi && k.meaning.vi.toLowerCase().includes(q)) ||
           (k.meaning.en && k.meaning.en.toLowerCase().includes(q)) ||
           k.onReadings.some(r => r.toLowerCase().includes(q)) ||
           k.kunReadings.some(r => r.toLowerCase().includes(q));
  });

  const handleItemClick = (item: KanjiItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
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

      <KanjiGrid 
        items={filteredData} 
        onItemClick={handleItemClick}
      />

      <KanjiDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
