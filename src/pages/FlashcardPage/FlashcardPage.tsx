import { FC, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, ProgressBar, Tab, TabList, SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import { Language } from '@types';
import { Dismiss24Regular, ArrowLeft24Regular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { Flashcard } from '@features/flashcards/components/Flashcard';
import { FlashcardControls } from '@features/flashcards/components/FlashcardControls';
import { getVocabForLesson, getGrammarForLesson, getKanjiForLesson } from '@data/index';
import { useAppSelector } from '@store/hooks';

import { EmptyState } from '@components/EmptyState';
import { Board24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';
import { VocabularyItem, GrammarPattern, KanjiItem } from '@types';

type FlashcardType = 'vocab' | 'grammar' | 'kanji' | 'mixed';

interface FlashcardEntry {
  id: string;
  front: { text: string; subtext?: string };
  back: { text: string; subtext?: string };
  sourceType: FlashcardType;
}

function buildVocabCards(items: VocabularyItem[], lang: Language): FlashcardEntry[] {
  return items.map(v => ({
    id: v.id,
    front: {
      text: v.kanji || v.hiragana,
      subtext: v.kanji ? v.hiragana : undefined,
    },
    back: {
      text: (v.meaning as any)[lang] || v.meaning.en,
      subtext: v.romaji,
    },
    sourceType: 'vocab' as const,
  }));
}

import { formatGrammarPattern } from '@features/grammar/utils';

function buildGrammarCards(items: GrammarPattern[], lang: Language): FlashcardEntry[] {
  return items.map(g => ({
    id: g.id,
    front: {
      text: formatGrammarPattern(g.pattern, lang),
      subtext: g.patternKana !== g.pattern ? formatGrammarPattern(g.patternKana, lang) : undefined,
    },
    back: {
      text: (g.title as any)[lang] || g.title.en,
      subtext: (g.explanation as any)[lang] || g.explanation.en,
    },
    sourceType: 'grammar' as const,
  }));
}

function buildKanjiCards(items: KanjiItem[], lang: Language): FlashcardEntry[] {
  return items.map(k => ({
    id: k.id,
    front: {
      text: k.character,
      subtext: [...k.onReadings, ...k.kunReadings].join('・') || undefined,
    },
    back: {
      text: (k.meaning as any)[lang] || k.meaning.en,
      subtext: k.compounds.length > 0 ? k.compounds.slice(0, 2).map(c => c.word).join('、') : undefined,
    },
    sourceType: 'kanji' as const,
  }));
}

export const FlashcardPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('flashcard');
  const lang = i18n.language as Language;
  const showRomaji = useAppSelector(state => state.progress.settings.showRomaji);
  const showFurigana = useAppSelector(state => state.progress.settings.showFurigana);

  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const initialType = (searchParams.get('type') as FlashcardType) || 'vocab';

  const [activeType, setActiveType] = useState<FlashcardType>(initialType);
  const [allCards, setAllCards] = useState<Record<FlashcardType, FlashcardEntry[]>>({
    vocab: [], grammar: [], kanji: [], mixed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getVocabForLesson(lessonId),
      getGrammarForLesson(lessonId),
      getKanjiForLesson(lessonId),
    ]).then(([vocab, grammar, kanji]) => {
      const vocabCards = buildVocabCards(vocab, lang);
      const grammarCards = buildGrammarCards(grammar, lang);
      const kanjiCards = buildKanjiCards(kanji, lang);
      const mixed = [...vocabCards, ...grammarCards, ...kanjiCards].sort(() => Math.random() - 0.5);
      setAllCards({ vocab: vocabCards, grammar: grammarCards, kanji: kanjiCards, mixed });
      setLoading(false);
    });
  }, [lessonId, lang]);

  const items = allCards[activeType];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Reset when switching type
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  }, [activeType]);

  const handleFlip = useCallback(() => setIsFlipped(true), []);

  const handleRate = useCallback(() => {
    setIsFlipped(false);
    if (currentIndex < items.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      setTimeout(() => setIsCompleted(true), 150);
    }
  }, [currentIndex, items.length]);

  const onTabSelect = (_: SelectTabEvent, data: SelectTabData) => {
    setActiveType(data.value as FlashcardType);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight' || e.code === 'Digit2' || e.code === 'Numpad2') {
        e.preventDefault();
        handleRate();
      } else if (e.code === 'ArrowLeft' || e.code === 'Digit1' || e.code === 'Numpad1') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
          setIsFlipped(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handleRate]);

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center' }}>{t('loading', 'Đang tải...')}</div>;
  }

  if (isCompleted) {
    return (
      <EmptyState
        icon={<CheckmarkCircle24Regular style={{ color: 'var(--colorPaletteGreenForeground1)' }} />}
        title={t('completed')}
        message={t('completed_message', 'Bạn đã ôn tập xong tất cả thẻ trong phiên này.')}
        action={
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button appearance="primary" onClick={() => { setCurrentIndex(0); setIsFlipped(false); setIsCompleted(false); }}>
              {t('restart', 'Làm lại')}
            </Button>
            <Button onClick={() => navigate(-1)}>{t('return_lesson')}</Button>
          </div>
        }
      />
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <EmptyState
        icon={<Board24Regular />}
        title={t('no_cards', 'Không có thẻ')}
        message={t('no_cards_message', 'Bài học này chưa có thẻ cho loại đang chọn.')}
        action={<Button onClick={() => navigate(-1)}>{t('return_lesson')}</Button>}
      />
    );
  }

  const currentItem = items[currentIndex];
  const total = items.length;

  // Apply furigana/romaji settings to vocab cards only
  const front = {
    text: currentItem?.front.text ?? '',
    subtext: currentItem?.sourceType === 'vocab'
      ? (showFurigana ? currentItem.front.subtext : undefined)
      : currentItem?.front.subtext,
  };
  const back = {
    text: currentItem?.back.text ?? '',
    subtext: currentItem?.sourceType === 'vocab'
      ? (showRomaji ? currentItem.back.subtext : undefined)
      : currentItem?.back.subtext,
  };

  const typeLabels: Record<FlashcardType, string> = {
    vocab: t('type_vocab', 'Từ vựng'),
    grammar: t('type_grammar', 'Ngữ pháp'),
    kanji: t('type_kanji', 'Hán tự'),
    mixed: t('type_mixed', 'Tổng hợp'),
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--colorNeutralBackground2)' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--colorNeutralBackground1)', borderBottom: '1px solid var(--colorNeutralStroke1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
          <Button icon={<Dismiss24Regular />} appearance="subtle" onClick={() => navigate(-1)} />
          <div style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              icon={<ArrowLeft24Regular />}
              appearance="subtle"
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(prev => Math.max(0, prev - 1));
                setIsFlipped(false);
              }}
              aria-label="Previous card"
            />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ProgressBar value={currentIndex + 1} max={total} />
              <span style={{ whiteSpace: 'nowrap', color: 'var(--colorNeutralForeground2)' }}>
                {t('progress', { count: currentIndex + 1, total })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Type Tabs */}
      <div style={{ backgroundColor: 'var(--colorNeutralBackground1)', borderBottom: '1px solid var(--colorNeutralStroke1)', padding: '0 24px' }}>
        <TabList selectedValue={activeType} onTabSelect={onTabSelect}>
          {(Object.keys(typeLabels) as FlashcardType[]).map(type => (
            <Tab key={type} value={type}>
              {typeLabels[type]}{allCards[type].length > 0 ? ` (${allCards[type].length})` : ''}
            </Tab>
          ))}
        </TabList>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        {currentItem && (
          <>
            <Flashcard
              front={front}
              back={back}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />
            <FlashcardControls
              isFlipped={isFlipped}
              onFlip={handleFlip}
              onRate={handleRate}
            />
          </>
        )}
      </div>
    </div>
  );
};
