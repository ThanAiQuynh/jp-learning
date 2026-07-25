import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { KanjiItem, Language } from '@types';
import { KanjiGrid } from '@features/kanji/components/KanjiGrid';
import { SearchBox } from '@fluentui/react-components';
import { ContactCard24Regular } from '@fluentui/react-icons';
import { KanjiDetail } from '@features/kanji/components/KanjiDetail';
import { PageHeader } from '@components/PageHeader';
import { LessonSelect } from '@components/LessonSelect';
import { EmptyState } from '@components/EmptyState';
import { getKanjiForLesson } from '@data/index';
import lessonsData from '@data/lessons/lessons.json';
import { useDebounce } from '@utils/useDebounce';
import styles from './KanjiPage.module.scss';

export const KanjiPage: FC = () => {
  const { t, i18n } = useTranslation('kanji');
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KanjiItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const currentLang = i18n.language as Language;
  const currentLessonMeta = lessonsData.find(l => l.id === lessonId);
  const lessonNumber = currentLessonMeta?.number || lessonId.replace('lesson-', '');
  const lessonTitle = currentLessonMeta ? ((currentLessonMeta.title as any)[currentLang] || currentLessonMeta.title.ja) : '';

  useEffect(() => {
    getKanjiForLesson(lessonId).then(data => setKanjiData(data));
  }, [lessonId]);

  const handleLessonChange = (newLessonId: string) => {
    setSearchParams({ lesson: newLessonId });
    setSearchQuery('');
  };

  const filteredData = kanjiData.filter(k => {
    if (!debouncedSearchQuery) return true;
    const q = debouncedSearchQuery.toLowerCase();
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
        <KanjiGrid 
          items={filteredData} 
          onItemClick={handleItemClick}
        />
      ) : (
        <EmptyState
          icon={<ContactCard24Regular />}
          title={t('no_kanji', 'Không tìm thấy Hán tự')}
          message={debouncedSearchQuery 
            ? t('no_kanji_search', 'Không có chữ Kanji nào khớp với từ khóa tìm kiếm.')
            : t('no_kanji_lesson', 'Bài học này chưa có dữ liệu Kanji.')}
        />
      )}

      <KanjiDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
