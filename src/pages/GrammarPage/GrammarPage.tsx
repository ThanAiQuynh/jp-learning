import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { GrammarPattern, Language } from '@types';
import { GrammarList } from '@features/grammar/components/GrammarList';
import { SearchBox } from '@fluentui/react-components';
import { Board24Regular } from '@fluentui/react-icons';
import { GrammarDetail } from '@features/grammar/components/GrammarDetail';
import { PageHeader } from '@components/PageHeader';
import { LessonSelect } from '@components/LessonSelect';
import { EmptyState } from '@components/EmptyState';
import { getGrammarForLesson } from '@data/index';
import lessonsData from '@data/lessons/lessons.json';
import { useDebounce } from '@utils/useDebounce';
import styles from './GrammarPage.module.scss';

export const GrammarPage: FC = () => {
  const { t, i18n } = useTranslation('grammar');
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [grammarData, setGrammarData] = useState<GrammarPattern[]>([]);
  const [selectedItem, setSelectedItem] = useState<GrammarPattern | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const currentLang = i18n.language as Language;
  const currentLessonMeta = lessonsData.find(l => l.id === lessonId);
  const lessonNumber = currentLessonMeta?.number || lessonId.replace('lesson-', '');
  const lessonTitle = currentLessonMeta ? ((currentLessonMeta.title as any)[currentLang] || currentLessonMeta.title.ja) : '';

  useEffect(() => {
    getGrammarForLesson(lessonId).then(data => setGrammarData(data));
  }, [lessonId]);

  const handleLessonChange = (newLessonId: string) => {
    setSearchParams({ lesson: newLessonId });
    setSearchQuery('');
  };

  const filteredData = grammarData.filter(g => {
    if (!debouncedSearchQuery) return true;
    const q = debouncedSearchQuery.toLowerCase();
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
    <div className={styles.root}>
      <PageHeader 
        title={t('title', { lesson: lessonNumber })}
        subtitle={lessonTitle ? `${lessonTitle} — ${t('subtitle')}` : t('subtitle')}
        action={
          <LessonSelect 
            value={lessonId} 
            onChange={handleLessonChange}
            style={{ minWidth: '180px' }}
          />
        }
      />

      <div className={styles.filterBar}>
        <SearchBox 
          placeholder={t('common.search', 'Search...')} 
          aria-label={t('common.search', 'Search...')}
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value || '')}
          className={styles.searchBox}
        />
      </div>

      {filteredData.length > 0 ? (
        <GrammarList 
          items={filteredData} 
          onDetailClick={handleItemClick}
        />
      ) : (
        <EmptyState
          icon={<Board24Regular />}
          title={t('no_grammar', 'Không tìm thấy ngữ pháp')}
          message={debouncedSearchQuery 
            ? t('no_grammar_search', 'Không có cấu trúc ngữ pháp nào khớp với từ khóa tìm kiếm.')
            : t('no_grammar_lesson', 'Bài học này chưa có dữ liệu ngữ pháp.')}
        />
      )}

      <GrammarDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
