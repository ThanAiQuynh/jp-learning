import { FC, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, ProgressBar } from '@fluentui/react-components';
import { Language } from '@types';
import { Dismiss24Regular, ArrowLeft24Regular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { Flashcard } from '@features/flashcards/components/Flashcard';
import { FlashcardControls } from '@features/flashcards/components/FlashcardControls';
import { getVocabForLesson } from '@data/index';

import { EmptyState } from '@components/EmptyState';
import { Board24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';
import { VocabularyItem } from '@types';

export const FlashcardPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('flashcard');
  const lang = i18n.language as Language;
  
  const lessonId = searchParams.get('lesson') || 'lesson-01';
  const [items, setItems] = useState<VocabularyItem[]>([]);
  
  useEffect(() => {
    getVocabForLesson(lessonId).then(data => setItems(data));
  }, [lessonId]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (items.length === 0) {
    return (
      <EmptyState 
        icon={<Board24Regular />}
        title="No cards found"
        message="This lesson currently has no flashcards."
        action={<Button onClick={() => navigate(-1)}>Go Back</Button>}
      />
    );
  }

  const currentItem = items[currentIndex];
  const total = items.length;

  const handleFlip = () => setIsFlipped(true);
  
  const handleRate = () => {
    setIsFlipped(false);
    if (currentIndex < total - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    } else {
      setTimeout(() => setIsCompleted(true), 150);
    }
  };

  if (isCompleted) {
    return (
      <EmptyState 
        icon={<CheckmarkCircle24Regular style={{ color: 'var(--colorPaletteGreenForeground1)' }} />}
        title={t('completed')}
        message="You have reviewed all cards in this session."
        action={
          <Button appearance="primary" onClick={() => navigate(-1)}>
            {t('return_lesson')}
          </Button>
        }
      />
    );
  }

  const front = {
    text: currentItem.kanji || currentItem.hiragana,
    subtext: currentItem.kanji ? currentItem.hiragana : undefined
  };
  
  const back = {
    text: (currentItem.meaning as any)[lang] || currentItem.meaning.en,
    subtext: currentItem.romaji
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

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
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
      </div>
    </div>
  );
};
