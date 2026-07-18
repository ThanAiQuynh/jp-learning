import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useSearchParams } from 'react-router-dom';

import { GrammarPattern } from '@types';
import { GrammarList } from '@features/grammar/components/GrammarList';
import { SearchBox, Button } from '@fluentui/react-components';
import { FilterRegular } from '@fluentui/react-icons';
import { GrammarDetail } from '@features/grammar/components/GrammarDetail';
import { PageHeader } from '@components/PageHeader';
import { getGrammarForLesson } from '@data/index';

export const GrammarPage: FC = () => {
  const { t } = useTranslation('grammar');
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [grammarData, setGrammarData] = useState<GrammarPattern[]>([]);
  const [selectedItem, setSelectedItem] = useState<GrammarPattern | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getGrammarForLesson(lessonId).then(data => setGrammarData(data));
  }, [lessonId]);

  const filteredData = grammarData.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.pattern.toLowerCase().includes(q) ||
           (g.title.vi && g.title.vi.toLowerCase().includes(q)) ||
           (g.title.en && g.title.en.toLowerCase().includes(q)) ||
           (g.explanation.vi && g.explanation.vi.toLowerCase().includes(q)) ||
           (g.explanation.en && g.explanation.en.toLowerCase().includes(q));
  });

  const handleItemClick = (item: GrammarPattern) => {
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

      <GrammarList 
        items={filteredData} 
        onDetailClick={handleItemClick}
      />

      <GrammarDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
