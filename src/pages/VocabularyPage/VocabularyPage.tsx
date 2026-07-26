import { FC, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { VocabularyItem, Language } from '@types';
import { VocabList } from '@features/vocabulary/components/VocabList';
import { SearchBox, Select } from '@fluentui/react-components';
import { Book24Regular } from '@fluentui/react-icons';
import { VocabDetail } from '@features/vocabulary/components/VocabDetail';
import { PageHeader } from '@components/PageHeader';
import { EmptyState } from '@components/EmptyState';
import { getAllVocab } from '@data/index';
import { playJapaneseSpeech } from '@utils/audio';
import { useDebounce } from '@utils/useDebounce';
import lessonsData from '@data/lessons/lessons.json';

import styles from './VocabularyPage.module.scss';

export const VocabularyPage: FC = () => {
  const { t, i18n } = useTranslation('vocabulary');
  const lang = i18n.language as Language;
  const [searchParams, setSearchParams] = useSearchParams();
  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rawLessonParam = searchParams.get('lesson');
  let selectedLesson = 'all';
  if (rawLessonParam) {
    if (rawLessonParam.startsWith('lesson-')) {
      selectedLesson = rawLessonParam;
    } else {
      const num = parseInt(rawLessonParam, 10);
      if (!isNaN(num)) {
        selectedLesson = `lesson-${String(num).padStart(2, '0')}`;
      }
    }
  }

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'all') {
      searchParams.delete('lesson');
    } else {
      searchParams.set('lesson', val);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    getAllVocab().then(data => setVocabData(data));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const filteredData = vocabData.filter(v => {
    if (selectedLesson !== 'all' && v.lessonId !== selectedLesson) {
      return false;
    }
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
        title={t('title')}
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
        <Select 
          value={selectedLesson} 
          onChange={handleLessonChange}
          className={styles.lessonSelect}
          aria-label="Filter by lesson"
        >
          <option value="all">{t('common.all_lessons', 'Tất cả bài học')}</option>
          {lessonsData.map(l => (
            <option key={l.id} value={l.id}>
              Bài {l.number}: {(l.title as any)[lang] || l.title.ja}
            </option>
          ))}
        </Select>
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
            : t('no_vocab_data', 'Chưa có dữ liệu từ vựng.')}
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
