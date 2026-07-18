import { FC, useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProgressBar, Button } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { CategoryType, VocabularyItem, KanjiItem } from '@types';
import { getVocabForLesson, getKanjiForLesson } from '@data/index';

import { QuizQuestion, QuizQuestionData } from '@features/quiz/components/QuizQuestion';
import { QuizSummary } from '@features/quiz/components/QuizSummary';

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);

  useEffect(() => {
    Promise.all([
      getVocabForLesson(lessonId),
      getKanjiForLesson(lessonId)
    ]).then(([vocab, kanji]) => {
      setVocabData(vocab);
      setKanjiData(kanji);
    });
  }, [lessonId]);

  // Generate Questions purely client-side for this demo
  const questions = useMemo(() => {
    const qs: QuizQuestionData[] = [];
    
    // Vocab questions
    const vItems = vocabData.filter(v => v.lessonId === lessonId);
    vItems.forEach(v => {
      if (!v.meaning.vi && !v.meaning.en) return;
      const others = shuffle(vItems.filter(x => x.id !== v.id)).slice(0, 3);
      const options = [
        { label: (v.meaning as any)[lang] || v.meaning.en, value: v.id, isCorrect: true },
        ...others.map(o => ({ label: (o.meaning as any)[lang] || o.meaning.en, value: o.id, isCorrect: false }))
      ];
      const wordDisplay = (v.kanji && v.kanji !== v.hiragana) ? `${v.kanji} (${v.hiragana})` : v.hiragana;
      qs.push({
        id: `v_${v.id}`,
        type: CategoryType.Vocabulary,
        questionText: t('questions.vocab_meaning', { word: wordDisplay }),
        options: shuffle(options)
      });
    });

    // Kanji questions
    const kItems = kanjiData.filter(k => k.lessonId === lessonId);
    kItems.forEach(k => {
      if (!k.meaning.vi && !k.meaning.en) return;
      const others = shuffle(kItems.filter(x => x.id !== k.id)).slice(0, 3);
      const options = [
        { label: (k.meaning as any)[lang] || k.meaning.en, value: k.id, isCorrect: true },
        ...others.map(o => ({ label: (o.meaning as any)[lang] || o.meaning.en, value: o.id, isCorrect: false }))
      ];
      const readings = [...k.kunReadings, ...k.onReadings].join(', ');
      const kanjiDisplay = readings ? `${k.character} (${readings})` : k.character;
      qs.push({
        id: `k_${k.id}`,
        type: CategoryType.Kanji,
        questionText: t('questions.kanji_meaning', { kanji: kanjiDisplay }),
        options: shuffle(options)
      });
    });

    return shuffle(qs).slice(0, 10); // Take 10 random questions
  }, [lessonId, vocabData, kanjiData, t, lang]);

  if (questions.length === 0) {
    return <div style={{ padding: 48, textAlign: 'center' }}>{t('questions.no_questions')}</div>;
  }

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(s => s + 1);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRetake = () => {
    setScore(0);
    setCurrentIndex(0);
    setIsCompleted(false);
  };

  const total = questions.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--colorNeutralBackground2)' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--colorNeutralBackground1)', borderBottom: '1px solid var(--colorNeutralStroke1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
          <Button icon={<Dismiss24Regular />} appearance="subtle" onClick={() => navigate(-1)} />
          <div style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <ProgressBar value={isCompleted ? total : currentIndex + 1} max={total} />
            <span style={{ whiteSpace: 'nowrap', color: 'var(--colorNeutralForeground2)' }}>
              {isCompleted ? t('progress.completed') : t('progress.question_count', { index: currentIndex + 1, total })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        {isCompleted ? (
          <QuizSummary score={score} total={total} lessonId={lessonId} onRetake={handleRetake} />
        ) : (
          <QuizQuestion question={questions[currentIndex]} onAnswer={handleAnswer} />
        )}
      </div>
    </div>
  );
};
