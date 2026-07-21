import { FC, useState, useEffect } from 'react';
import { Title1, Title3, Button, Card } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { CategoryType } from '@types';
import styles from './QuizQuestion.module.scss';

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

  const getOptionClassName = (index: number, isCorrect: boolean) => {
    if (selectedOption === null) return styles.optionBtn;
    if (isCorrect) return `${styles.optionBtn} ${styles.correct}`;
    if (selectedOption === index) return `${styles.optionBtn} ${styles.incorrect}`;
    return `${styles.optionBtn} ${styles.dimmed}`;
  };

  return (
    <Card className={styles.quizCard}>
      <Title3 className={styles.quizCategory}>
        {t(`categories.${question.type}`)}
      </Title3>
      <Title1 className={styles.quizTitle}>{question.questionText}</Title1>
      
      <div className={styles.optionsGrid}>
        {question.options.map((opt, i) => (
          <Button 
            key={i} 
            size="large" 
            onClick={() => handleSelect(i, opt.isCorrect)}
            className={getOptionClassName(i, opt.isCorrect)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className={styles.feedbackContainer}>
        {selectedOption !== null && (
          <Title3 className={`${styles.feedbackText} ${question.options[selectedOption].isCorrect ? styles.correct : styles.incorrect}`}>
            {question.options[selectedOption].isCorrect ? t('feedback.correct', 'Chính xác!') : t('feedback.incorrect', 'Sai rồi!')}
          </Title3>
        )}
      </div>
    </Card>
  );
};
