import { FC, useState, useRef, useEffect } from 'react';
import { Button, Input, Title1, Title3, Caption1Strong, Card } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { CheckmarkCircle24Regular, DismissCircle24Regular } from '@fluentui/react-icons';
import styles from './FillBlankQuestion.module.scss';

export interface FillBlankQuestionData {
  id: string;
  sentenceWithBlank: string;  // e.g. "わたしは ___ です"
  answer: string;              // correct answer e.g. "マイク"
  hint?: string;               // optional hint e.g. reading
  explanation: string;         // shown after answering
}

export interface FillBlankQuestionProps {
  question: FillBlankQuestionData;
  onAnswer: (isCorrect: boolean) => void;
}

export const FillBlankQuestion: FC<FillBlankQuestionProps> = ({ question, onAnswer }) => {
  const { t } = useTranslation('quiz');
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUserInput('');
    setSubmitted(false);
    setIsCorrect(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const correct = userInput.trim() === question.answer.trim();
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handleNext = () => {
    onAnswer(isCorrect);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!submitted) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  // Render sentence with blank highlighted
  const parts = question.sentenceWithBlank.split('___');

  return (
    <Card className={styles.card}>
      <Title3 className={styles.categoryTitle}>
        {t('fill_blank.title', 'Điền vào chỗ trống')}
      </Title3>

      {/* Sentence display */}
      <Title1 className={styles.sentenceTitle}>
        {parts[0]}
        <span className={`${styles.blankSpan} ${submitted ? (isCorrect ? styles.correct : styles.incorrect) : ''}`}>
          {submitted ? question.answer : (userInput || '\u00a0')}
        </span>
        {parts[1]}
      </Title1>

      {/* Input */}
      {!submitted ? (
        <div className={styles.inputGroup}>
          <Input
            ref={inputRef}
            value={userInput}
            onChange={(_, data) => setUserInput(data.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.hint || t('fill_blank.placeholder', 'Nhập câu trả lời...')}
            className={styles.answerInput}
            autoFocus
          />
          <Button appearance="primary" size="large" onClick={handleSubmit} disabled={!userInput.trim()}>
            {t('fill_blank.submit', 'Kiểm tra')}
          </Button>
        </div>
      ) : (
        <div className={styles.resultGroup}>
          {isCorrect ? (
            <div className={`${styles.feedbackRow} ${styles.correct}`}>
              <CheckmarkCircle24Regular />
              <Title3 className={`${styles.feedbackTitle} ${styles.correct}`}>{t('feedback.correct', 'Chính xác!')}</Title3>
            </div>
          ) : (
            <div>
              <div className={`${styles.feedbackRow} ${styles.incorrect}`}>
                <DismissCircle24Regular />
                <Title3 className={`${styles.feedbackTitle} ${styles.incorrect}`}>{t('feedback.incorrect', 'Sai rồi!')}</Title3>
              </div>
              <Caption1Strong style={{ color: 'var(--colorNeutralForeground2)' }}>
                {t('fill_blank.your_answer', 'Bạn đã nhập:')} <em>"{userInput}"</em>
              </Caption1Strong>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {submitted && (
        <>
          <div className={styles.explanationBox}>
            <Caption1Strong style={{ color: 'var(--colorNeutralForeground3)', display: 'block', marginBottom: '4px' }}>
              {t('fill_blank.explanation', 'Giải thích')}
            </Caption1Strong>
            <span style={{ color: 'var(--colorNeutralForeground1)' }}>{question.explanation}</span>
          </div>

          <div className={styles.nextActionContainer}>
            <Button appearance="primary" size="large" onClick={handleNext} autoFocus>
              {t('feedback.next', 'Tiếp tục')}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};
