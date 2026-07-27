import { FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KanjiItem } from '@types';
import { KanjiGrid } from '@features/kanji/components/KanjiGrid';
import { SearchBox, Select } from '@fluentui/react-components';
import { ContactCard24Regular } from '@fluentui/react-icons';
import { KanjiDetail } from '@features/kanji/components/KanjiDetail';
import { PageHeader } from '@components/PageHeader';
import { EmptyState } from '@components/EmptyState';
import { getAllKanji } from '@data/index';
import { useDebounce } from '@utils/useDebounce';
import { getLocalizedText } from '@utils/i18n';
import lessonsData from '@data/lessons/lessons.json';

import styles from './KanjiPage.module.scss';

export const KanjiPage: FC = () => {
  const { t, i18n } = useTranslation(['kanji', 'common']);
  const lang = i18n.language;
  const [searchParams, setSearchParams] = useSearchParams();
  const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<KanjiItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);

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
    getAllKanji().then(data => setKanjiData(data));
  }, []);

  const filteredData = kanjiData.filter(k => {
    if (selectedLesson !== 'all' && k.lessonId !== selectedLesson) {
      return false;
    }
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
        title={t('kanji:title')}
        subtitle={t('kanji:subtitle')}
      />

      <div className={styles.filterBar}>
        <SearchBox 
          placeholder={t('common:common.search')} 
          aria-label={t('common:common.search')}
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value || '')}
          className={styles.searchBox}
        />
        <Select 
          value={selectedLesson} 
          onChange={handleLessonChange}
          className={styles.lessonSelect}
          aria-label={t('common:common.filter_by_lesson')}
        >
          <option value="all">{t('common:common.all_lessons')}</option>
          {lessonsData.map(l => (
            <option key={l.id} value={l.id}>
              {t('common:courses_page.lesson_number', { number: l.number })}: {getLocalizedText(l.title, lang)}
            </option>
          ))}
        </Select>
      </div>

      {filteredData.length > 0 ? (
        <KanjiGrid 
          items={filteredData} 
          onItemClick={handleItemClick}
        />
      ) : (
        <EmptyState
          icon={<ContactCard24Regular />}
          title={t('kanji:no_kanji')}
          message={debouncedSearchQuery 
            ? t('kanji:no_kanji_search')
            : t('kanji:no_kanji_data')}
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
