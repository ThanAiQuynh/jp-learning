import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchBox, Select } from '@fluentui/react-components';
import { DocumentText24Regular } from '@fluentui/react-icons';
import { Radical } from '@types';
import { getAllRadicals } from '@data';
import { PageHeader } from '@components/PageHeader';
import { EmptyState } from '@components/EmptyState';
import { useDebounce } from '@utils/useDebounce';
import { getLocalizedText } from '@utils/i18n';
import { RadicalGrid, RadicalDetail } from '../../features/radicals/components';

import styles from './RadicalPage.module.scss';

export const RadicalPage: FC = () => {
  const { t, i18n } = useTranslation(['common', 'kanji']);
  const lang = i18n.language;
  const [radicals, setRadicals] = useState<Radical[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<Radical | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const [selectedStroke, setSelectedStroke] = useState<string>('all');

  useEffect(() => {
    const fetchRadicals = async () => {
      try {
        const data = await getAllRadicals();
        setRadicals(data);
      } catch (error) {
        console.error('Failed to load radicals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRadicals();
  }, []);

  const strokeOptions = Array.from(new Set(radicals.map(r => r.strokeCount))).sort((a, b) => a - b);

  const filteredRadicals = radicals.filter(r => {
    if (selectedStroke !== 'all' && r.strokeCount !== parseInt(selectedStroke, 10)) {
      return false;
    }
    if (!debouncedSearchQuery) return true;
    const q = debouncedSearchQuery.toLowerCase();
    const localizedName = getLocalizedText(r.name, lang).toLowerCase();
    const localizedMeaning = getLocalizedText(r.meaning, lang).toLowerCase();
    const jaName = (r.name.ja || '').toLowerCase();
    
    return r.character.includes(q) ||
           (r.variants && r.variants.some(v => v.includes(q))) ||
           localizedName.includes(q) ||
           localizedMeaning.includes(q) ||
           jaName.includes(q);
  });

  const handleItemClick = (item: Radical) => {
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
        title={t('navigation.radicals')}
        subtitle={t('radicals_page.subtitle')}
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
          value={selectedStroke} 
          onChange={(e) => setSelectedStroke(e.target.value)}
          className={styles.strokeSelect}
          aria-label="Filter by stroke count"
        >
          <option value="all">{t('radicals_page.all_strokes')}</option>
          {strokeOptions.map(st => (
            <option key={st} value={st}>
              {t('radicals_page.filter_stroke', { count: st })}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center' }}>{t('common.loading')}</div>
      ) : filteredRadicals.length > 0 ? (
        <RadicalGrid items={filteredRadicals} onItemClick={handleItemClick} />
      ) : (
        <EmptyState
          icon={<DocumentText24Regular />}
          title={t('radicals_page.no_radicals')}
          message={debouncedSearchQuery 
            ? t('radicals_page.no_radicals_search')
            : t('radicals_page.no_radicals_data')}
        />
      )}

      <RadicalDetail
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        item={selectedItem}
      />
    </div>
  );
};
