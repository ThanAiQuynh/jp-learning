import { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { VocabularyItem, Language } from '@types';
import { VocabList } from '@features/vocabulary/components/VocabList';
import { SearchBox } from '@fluentui/react-components';
import { Book24Regular } from '@fluentui/react-icons';
import { VocabDetail } from '@features/vocabulary/components/VocabDetail';
import { PageHeader } from '@components/PageHeader';
import { LessonSelect } from '@components/LessonSelect';
import { EmptyState } from '@components/EmptyState';
import { getVocabForLesson } from '@data/index';
import lessonsData from '@data/lessons/lessons.json';
import { playJapaneseSpeech } from '@utils/audio';
import { useDebounce } from '@utils/useDebounce';

import styles from './VocabularyPage.module.scss';

export const VocabularyPage: FC = () => {
  const { t, i18n } = useTranslation('vocabulary');
  const [searchParams, setSearchParams] = useSearchParams();
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentLang = i18n.language as Language;
  const currentLessonMeta = lessonsData.find(l => l.id === lessonId);
  const lessonNumber = currentLessonMeta?.number || lessonId.replace('lesson-', '');
  const lessonTitle = currentLessonMeta ? ((currentLessonMeta.title as any)[currentLang] || currentLessonMeta.title.ja) : '';

  useEffect(() => {
    getVocabForLesson(lessonId).then(data => setVocabData(data));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lessonId]);

  const handleLessonChange = (newLessonId: string) => {
    setSearchParams({ lesson: newLessonId });
    setSearchQuery('');
  };

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
        title={t('title', { lesson: lessonNumber })}
        subtitle={lessonTitle ? `${lessonTitle} — ${t('subtitle')}` : (t('subtitle') as string)}
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
        <VocabList 
          items={filteredData} 
          onItemClick={handleItemClick}
          onPlayAudio={(item) => playJapaneseSpeech(item.hiragana || item.kanji || '')}
        />
      ) : (
        <EmptyState
          icon={<Book24Regular />}
          title={t('no_vocab', 'Không tìm thấy từ vựng')}
          message={debouncedSearchQuery 
            ? t('no_vocab_search', 'Không có từ vựng nào khớp với từ khóa tìm kiếm.')
            : t('no_vocab_lesson', 'Bài học này chưa có dữ liệu từ vựng.')}
        />
      )}

      <VocabDetail 
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
