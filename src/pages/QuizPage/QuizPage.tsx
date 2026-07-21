import { FC, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressBar, Button, Tab, TabList, SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { CategoryType, VocabularyItem, KanjiItem, GrammarPattern, Language } from '@types';
import { getVocabForLesson, getKanjiForLesson, getGrammarForLesson } from '@data/index';
import { formatGrammarPattern } from '@features/grammar/utils';

import { QuizQuestion, QuizQuestionData } from '@features/quiz/components/QuizQuestion';
import { QuizSummary } from '@features/quiz/components/QuizSummary';
import { MatchingQuestion, MatchingPair } from '@features/quiz/components/MatchingQuestion';
import { FillBlankQuestion, FillBlankQuestionData } from '@features/quiz/components/FillBlankQuestion';

type QuizMode = 'multiple-choice' | 'matching' | 'fill-blank';
type QuizCategory = 'vocabulary' | 'grammar' | 'kanji' | 'mixed';

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const QuizPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('quiz');
  const lang = i18n.language as 'en' | 'vi' | 'ja';
  const lessonId = searchParams.get('lesson') || 'lesson-01';

  // Config state
  const [mode, setMode] = useState<QuizMode>('multiple-choice');
  const [category, setCategory] = useState<QuizCategory>('mixed');

  // Data state
  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);
  const [grammarData, setGrammarData] = useState<GrammarPattern[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Quiz state
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    Promise.all([
      getVocabForLesson(lessonId),
      getKanjiForLesson(lessonId),
      getGrammarForLesson(lessonId),
    ]).then(([vocab, kanji, grammar]) => {
      setVocabData(vocab);
      setKanjiData(kanji);
      setGrammarData(grammar);
      setDataLoaded(true);
    });
  }, [lessonId]);

  // ── Multiple Choice questions ──────────────────────────────────────────────
  const mcQuestions = useMemo((): QuizQuestionData[] => {
    if (!dataLoaded) return [];
    const qs: QuizQuestionData[] = [];

    const addVocab = category === 'vocabulary' || category === 'mixed';
    const addKanji = category === 'kanji' || category === 'mixed';
    const addGrammar = category === 'grammar' || category === 'mixed';

    if (addVocab) {
      vocabData.forEach(v => {
        if (!v.meaning.vi && !v.meaning.en) return;
        const others = shuffle(vocabData.filter(x => x.id !== v.id)).slice(0, 3);
        if (others.length < 2) return;
        const options = shuffle([
          { label: (v.meaning as any)[lang] || v.meaning.en, value: v.id, isCorrect: true },
          ...others.map(o => ({ label: (o.meaning as any)[lang] || o.meaning.en, value: o.id, isCorrect: false }))
        ]);
        const wordDisplay = (v.kanji && v.kanji !== v.hiragana) ? `${v.kanji} (${v.hiragana})` : v.hiragana;
        qs.push({ id: `v_${v.id}`, type: CategoryType.Vocabulary, questionText: t('questions.vocab_meaning', { word: wordDisplay }), options });
      });
    }

    if (addKanji) {
      kanjiData.forEach(k => {
        if (!k.meaning.vi && !k.meaning.en) return;
        const others = shuffle(kanjiData.filter(x => x.id !== k.id)).slice(0, 3);
        if (others.length < 2) return;
        const options = shuffle([
          { label: (k.meaning as any)[lang] || k.meaning.en, value: k.id, isCorrect: true },
          ...others.map(o => ({ label: (o.meaning as any)[lang] || o.meaning.en, value: o.id, isCorrect: false }))
        ]);
        const readings = [...k.kunReadings, ...k.onReadings].join(', ');
        const kanjiDisplay = readings ? `${k.character} (${readings})` : k.character;
        qs.push({ id: `k_${k.id}`, type: CategoryType.Kanji, questionText: t('questions.kanji_meaning', { kanji: kanjiDisplay }), options });
      });
    }

    if (addGrammar) {
      grammarData.forEach(g => {
        if (!g.title.vi && !g.title.en) return;
        const others = shuffle(grammarData.filter(x => x.id !== g.id)).slice(0, 3);
        if (others.length < 2) return;
        const options = shuffle([
          { label: (g.title as any)[lang] || g.title.en, value: g.id, isCorrect: true },
          ...others.map(o => ({ label: (o.title as any)[lang] || o.title.en, value: o.id, isCorrect: false }))
        ]);
        // Show an example sentence as question
        const example = g.examples?.[0];
        const questionText = example
          ? t('questions.grammar_example', { example: example.ja })
          : t('questions.grammar_meaning', { pattern: formatGrammarPattern(g.pattern, lang as Language) });
        qs.push({ id: `g_${g.id}`, type: CategoryType.Grammar, questionText, options });
      });
    }

    return shuffle(qs).slice(0, 10);
  }, [dataLoaded, category, vocabData, kanjiData, grammarData, t, lang]);

  // ── Matching pairs ─────────────────────────────────────────────────────────
  const matchingPairs = useMemo((): MatchingPair[] => {
    if (!dataLoaded) return [];
    let items: { id: string; left: string; right: string }[] = [];

    if (category === 'vocabulary' || category === 'mixed') {
      items.push(...vocabData.slice(0, 6).map(v => ({
        id: v.id,
        left: v.kanji || v.hiragana,
        right: (v.meaning as any)[lang] || v.meaning.en,
      })));
    }
    if (category === 'kanji' || category === 'mixed') {
      items.push(...kanjiData.slice(0, 4).map(k => ({
        id: k.id,
        left: k.character,
        right: (k.meaning as any)[lang] || k.meaning.en,
      })));
    }
    if (category === 'grammar' || category === 'mixed') {
      items.push(...grammarData.slice(0, 4).map(g => ({
        id: g.id,
        left: formatGrammarPattern(g.pattern, lang as Language),
        right: (g.title as any)[lang] || g.title.en,
      })));
    }
    return shuffle(items).slice(0, 8);
  }, [dataLoaded, category, vocabData, kanjiData, grammarData, lang]);

  // ── Fill-blank questions ───────────────────────────────────────────────────
  const fillBlankQuestions = useMemo((): FillBlankQuestionData[] => {
    if (!dataLoaded) return [];
    const qs: FillBlankQuestionData[] = [];

    if (category === 'vocabulary' || category === 'mixed') {
      vocabData.forEach(v => {
        if (!v.examples || v.examples.length === 0) return;
        const ex = v.examples[0];
        const word = v.kanji || v.hiragana;
        if (!ex.ja.includes(word)) return;
        qs.push({
          id: `fb_v_${v.id}`,
          sentenceWithBlank: ex.ja.replace(word, '___'),
          answer: word,
          hint: v.hiragana,
          explanation: `${word}（${v.hiragana}）: ${(v.meaning as any)[lang] || v.meaning.en}`,
        });
      });
    }

    if (category === 'grammar' || category === 'mixed') {
      grammarData.forEach(g => {
        g.examples?.forEach((ex, idx) => {
          // Try to blank out a key part in the example
          const particle = g.pattern.match(/[はがをにでもとから]/)?.[0];
          if (particle && ex.ja.includes(particle)) {
            qs.push({
              id: `fb_g_${g.id}_${idx}`,
              sentenceWithBlank: ex.ja.replace(particle, '___'),
              answer: particle,
              hint: formatGrammarPattern(g.pattern, lang as Language),
              explanation: `${formatGrammarPattern(g.pattern, lang as Language)}: ${(g.title as any)[lang] || g.title.en}`,
            });
          }
        });
      });
    }

    return shuffle(qs).slice(0, 8);
  }, [dataLoaded, category, vocabData, grammarData, lang]);

  // ── Quiz engine ────────────────────────────────────────────────────────────
  const handleMcAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(s => s + 1);
    if (currentIndex < mcQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleMatchingComplete = (correct: number, _total: number) => {
    setScore(correct);
    setIsCompleted(true);
    // For matching, total is the pairs count
    // We'll store it in a synthetic way
  };

  const handleFillBlankAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(s => s + 1);
    if (currentIndex < fillBlankQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRetake = () => {
    setScore(0);
    setCurrentIndex(0);
    setIsCompleted(false);
    setStarted(false);
  };

  // ── Config screen ──────────────────────────────────────────────────────────
  const modeLabels: Record<QuizMode, string> = {
    'multiple-choice': t('mode.multiple_choice', 'Trắc nghiệm'),
    'matching': t('mode.matching', 'Nối từ'),
    'fill-blank': t('mode.fill_blank', 'Điền từ'),
  };
  const categoryLabels: Record<QuizCategory, string> = {
    vocabulary: t('categories.vocabulary', 'Từ vựng'),
    grammar: t('categories.grammar', 'Ngữ pháp'),
    kanji: t('categories.kanji', 'Hán tự'),
    mixed: t('categories.mixed', 'Tổng hợp'),
  };

  const getQuestionCount = () => {
    if (mode === 'multiple-choice') return mcQuestions.length;
    if (mode === 'matching') return matchingPairs.length;
    return fillBlankQuestions.length;
  };

  const onModeTabSelect = (_: SelectTabEvent, data: SelectTabData) => setMode(data.value as QuizMode);
  const onCategoryTabSelect = (_: SelectTabEvent, data: SelectTabData) => setCategory(data.value as QuizCategory);

  if (!started) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--colorNeutralBackground2)' }}>
        <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', backgroundColor: 'var(--colorNeutralBackground1)', borderBottom: '1px solid var(--colorNeutralStroke1)' }}>
          <Button icon={<Dismiss24Regular />} appearance="subtle" onClick={() => navigate(-1)} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
          <div style={{ maxWidth: '560px', width: '100%' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '24px', textAlign: 'center' }}>
              {t('config.title', 'Cấu hình bài kiểm tra')}
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ marginBottom: '8px', fontWeight: 600 }}>{t('config.mode', 'Hình thức')}</p>
              <TabList selectedValue={mode} onTabSelect={onModeTabSelect}>
                {(Object.keys(modeLabels) as QuizMode[]).map(m => (
                  <Tab key={m} value={m}>{modeLabels[m]}</Tab>
                ))}
              </TabList>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ marginBottom: '8px', fontWeight: 600 }}>{t('config.category', 'Nội dung')}</p>
              <TabList selectedValue={category} onTabSelect={onCategoryTabSelect}>
                {(Object.keys(categoryLabels) as QuizCategory[]).map(c => (
                  <Tab key={c} value={c}>{categoryLabels[c]}</Tab>
                ))}
              </TabList>
            </div>

            <div style={{ textAlign: 'center' }}>
              {dataLoaded && getQuestionCount() === 0 ? (
                <p style={{ color: 'var(--colorNeutralForeground3)', marginBottom: '16px' }}>
                  {t('questions.no_questions')}
                </p>
              ) : dataLoaded && (
                <p style={{ color: 'var(--colorNeutralForeground3)', marginBottom: '16px' }}>
                  {t('config.question_count', { count: getQuestionCount() })}
                </p>
              )}
              <Button
                appearance="primary"
                size="large"
                disabled={!dataLoaded || getQuestionCount() === 0}
                onClick={() => setStarted(true)}
              >
                {t('config.start', 'Bắt đầu')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Active quiz ────────────────────────────────────────────────────────────
  const total = mode === 'multiple-choice' ? mcQuestions.length
    : mode === 'matching' ? matchingPairs.length
    : fillBlankQuestions.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--colorNeutralBackground2)' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--colorNeutralBackground1)', borderBottom: '1px solid var(--colorNeutralStroke1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
          <Button icon={<Dismiss24Regular />} appearance="subtle" onClick={() => navigate(-1)} />
          <div style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {mode !== 'matching' && (
              <>
                <ProgressBar value={isCompleted ? total : currentIndex + 1} max={total} />
                <span style={{ whiteSpace: 'nowrap', color: 'var(--colorNeutralForeground2)' }}>
                  {isCompleted ? t('progress.completed') : t('progress.question_count', { index: currentIndex + 1, total })}
                </span>
              </>
            )}
            {mode === 'matching' && (
              <span style={{ color: 'var(--colorNeutralForeground2)' }}>
                {modeLabels[mode]} — {categoryLabels[category]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        {isCompleted && mode !== 'matching' ? (
          <QuizSummary score={score} total={total} lessonId={lessonId} onRetake={handleRetake} />
        ) : mode === 'multiple-choice' ? (
          <QuizQuestion question={mcQuestions[currentIndex]} onAnswer={handleMcAnswer} />
        ) : mode === 'matching' ? (
          isCompleted
            ? <QuizSummary score={score} total={matchingPairs.length} lessonId={lessonId} onRetake={handleRetake} />
            : <MatchingQuestion pairs={matchingPairs} onComplete={handleMatchingComplete} />
        ) : (
          <FillBlankQuestion question={fillBlankQuestions[currentIndex]} onAnswer={handleFillBlankAnswer} />
        )}
      </div>
    </div>
  );
};
