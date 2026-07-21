import { FC, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@components/PageHeader';
import { Tab, TabList, SelectTabData, SelectTabEvent } from '@fluentui/react-components';

import { VocabularyItem, GrammarPattern, KanjiItem } from '@types';
import { getAllVocab, getAllGrammar, getAllKanji } from '@data/index';

import { VocabList } from '@features/vocabulary/components/VocabList';
import { VocabDetail } from '@features/vocabulary/components/VocabDetail';
import { GrammarList } from '@features/grammar/components/GrammarList';
import { GrammarDetail } from '@features/grammar/components/GrammarDetail';
import { KanjiGrid } from '@features/kanji/components/KanjiGrid';
import { KanjiDetail } from '@features/kanji/components/KanjiDetail';
import styles from './SearchPage.module.scss';

export const SearchPage: FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<string>('vocab');

  const [vocabResults, setVocabResults] = useState<VocabularyItem[]>([]);
  const [grammarResults, setGrammarResults] = useState<GrammarPattern[]>([]);
  const [kanjiResults, setKanjiResults] = useState<KanjiItem[]>([]);

  // Selection states for detail drawers
  const [selectedVocab, setSelectedVocab] = useState<VocabularyItem | null>(null);
  const [selectedGrammar, setSelectedGrammar] = useState<GrammarPattern | null>(null);
  const [selectedKanji, setSelectedKanji] = useState<KanjiItem | null>(null);

  useEffect(() => {
    if (!query) {
      setVocabResults([]);
      setGrammarResults([]);
      setKanjiResults([]);
      return;
    }
    const q = query.toLowerCase();

    Promise.all([getAllVocab(), getAllGrammar(), getAllKanji()]).then(([allVocab, allGrammar, allKanji]) => {
      setVocabResults(allVocab.filter(v => 
        v.hiragana.toLowerCase().includes(q) || 
        (v.kanji && v.kanji.toLowerCase().includes(q)) || 
        (v.romaji && v.romaji.toLowerCase().includes(q)) ||
        (v.meaning.vi && v.meaning.vi.toLowerCase().includes(q)) ||
        (v.meaning.en && v.meaning.en.toLowerCase().includes(q))
      ));

      setGrammarResults(allGrammar.filter(g => 
        g.pattern.toLowerCase().includes(q) ||
        (g.title.vi && g.title.vi.toLowerCase().includes(q)) ||
        (g.title.en && g.title.en.toLowerCase().includes(q)) ||
        (g.explanation.vi && g.explanation.vi.toLowerCase().includes(q)) ||
        (g.explanation.en && g.explanation.en.toLowerCase().includes(q))
      ));

      setKanjiResults(allKanji.filter(k => 
        k.character.toLowerCase().includes(q) ||
        (k.meaning.vi && k.meaning.vi.toLowerCase().includes(q)) ||
        (k.meaning.en && k.meaning.en.toLowerCase().includes(q)) ||
        k.onReadings.some(r => r.toLowerCase().includes(q)) ||
        k.kunReadings.some(r => r.toLowerCase().includes(q))
      ));
    });
  }, [query]);

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value as string);
  };

  return (
    <div className={styles.root}>
      <PageHeader 
        title={t('search.title', 'Search Results')}
        subtitle={t('search.subtitle', 'Results for "{{query}}"', { query })}
      />

      <TabList selectedValue={activeTab} onTabSelect={onTabSelect} className={styles.tabList}>
        <Tab value="vocab">{t('navigation.vocabulary')} ({vocabResults.length})</Tab>
        <Tab value="grammar">{t('navigation.grammar')} ({grammarResults.length})</Tab>
        <Tab value="kanji">{t('navigation.kanji')} ({kanjiResults.length})</Tab>
      </TabList>

      {activeTab === 'vocab' && (
        <VocabList items={vocabResults} onItemClick={setSelectedVocab} />
      )}
      {activeTab === 'grammar' && (
        <GrammarList items={grammarResults} onDetailClick={setSelectedGrammar} />
      )}
      {activeTab === 'kanji' && (
        <KanjiGrid items={kanjiResults} onItemClick={setSelectedKanji} />
      )}

      {/* Detail Drawers */}
      <VocabDetail 
        isOpen={!!selectedVocab} 
        item={selectedVocab} 
        onClose={() => setSelectedVocab(null)} 
      />
      <GrammarDetail 
        isOpen={!!selectedGrammar} 
        item={selectedGrammar} 
        onClose={() => setSelectedGrammar(null)} 
      />
      <KanjiDetail 
        isOpen={!!selectedKanji} 
        item={selectedKanji} 
        onClose={() => setSelectedKanji(null)} 
      />
    </div>
  );
};
