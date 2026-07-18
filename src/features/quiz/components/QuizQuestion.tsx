import { FC, useState, useEffect } from 'react';
import { Title1, Title3, Button, Card } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { CategoryType } from '@types';

export interface QuizQuestionData {
  id: string;
  type: CategoryType;
  questionText: string;
  options: { label: string; value: string; isCorrect: boolean }[];
}

export interface QuizQuestionProps {
  question: QuizQuestionData;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizQuestion: FC<QuizQuestionProps> = ({ question, onAnswer }) => {
  const { t } = useTranslation('quiz');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [question.id]);

  const handleSelect = (index: number, isCorrect: boolean) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500); // Wait 1.5s to show feedback
  };

  const getButtonStyle = (index: number, isCorrect: boolean) => {
    if (selectedOption === null) return {};
    if (isCorrect) return { backgroundColor: '#107C10', color: 'white' }; // Green for correct
    if (selectedOption === index) return { backgroundColor: '#D13438', color: 'white' }; // Red for wrong
    return { opacity: 0.5 };
  };

  return (
    <Card style={{ padding: '32px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <Title3 style={{ marginBottom: '8px', color: 'var(--colorNeutralForeground3)' }}>
        {t(`categories.${question.type}`)}
      </Title3>
      <Title1 style={{ marginBottom: '32px' }}>{question.questionText}</Title1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {question.options.map((opt, i) => (
          <Button 
            key={i} 
            size="large" 
            onClick={() => handleSelect(i, opt.isCorrect)}
            style={{ 
              height: 'auto', 
              minHeight: '64px', 
              fontSize: '18px', 
              whiteSpace: 'normal',
              ...getButtonStyle(i, opt.isCorrect)
            }}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div style={{ height: '32px', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selectedOption !== null && (
          <Title3 style={{ color: question.options[selectedOption].isCorrect ? '#107C10' : '#D13438' }}>
            {question.options[selectedOption].isCorrect ? t('feedback.correct', 'Chính xác!') : t('feedback.incorrect', 'Sai rồi!')}
          </Title3>
        )}
      </div>
    </Card>
  );
};
