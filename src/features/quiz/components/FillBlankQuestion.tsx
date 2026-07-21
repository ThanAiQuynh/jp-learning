import { FC, useState, useRef } from 'react';
import { Button, Input, Title1, Title3, Caption1Strong, Card } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { CheckmarkCircle24Regular, DismissCircle24Regular } from '@fluentui/react-icons';

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

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const correct = userInput.trim() === question.answer.trim();
    setIsCorrect(correct);
    setSubmitted(true);
    setTimeout(() => {
      onAnswer(correct);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitted) {
      handleSubmit();
    }
  };

  // Render sentence with blank highlighted
  const parts = question.sentenceWithBlank.split('___');

  return (
    <Card style={{ padding: '32px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <Title3 style={{ marginBottom: '8px', color: 'var(--colorNeutralForeground3)' }}>
        {t('fill_blank.title', 'Điền vào chỗ trống')}
      </Title3>

      {/* Sentence display */}
      <Title1 style={{ marginBottom: '32px', fontFamily: 'Noto Sans JP, sans-serif', lineHeight: 1.6 }}>
        {parts[0]}
        <span style={{
          display: 'inline-block',
          minWidth: '80px',
          borderBottom: `3px solid ${submitted ? (isCorrect ? '#107C10' : '#D13438') : 'var(--colorBrandForeground1)'}`,
          color: submitted ? (isCorrect ? '#107C10' : '#D13438') : 'var(--colorBrandForeground1)',
          padding: '0 8px',
          transition: 'border-color 0.3s, color 0.3s',
        }}>
          {submitted ? question.answer : (userInput || '\u00a0')}
        </span>
        {parts[1]}
      </Title1>

      {/* Input */}
      {!submitted ? (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
          <Input
            ref={inputRef}
            value={userInput}
            onChange={(_, data) => setUserInput(data.value)}
            onKeyDown={handleKeyDown}
            placeholder={question.hint || t('fill_blank.placeholder', 'Nhập câu trả lời...')}
            style={{ fontSize: '18px', textAlign: 'center', minWidth: '200px' }}
            autoFocus
          />
          <Button appearance="primary" size="large" onClick={handleSubmit} disabled={!userInput.trim()}>
            {t('fill_blank.submit', 'Kiểm tra')}
          </Button>
        </div>
      ) : (
        <div style={{ marginBottom: '16px' }}>
          {isCorrect ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#107C10' }}>
              <CheckmarkCircle24Regular />
              <Title3 style={{ color: '#107C10' }}>{t('feedback.correct', 'Chính xác!')}</Title3>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#D13438', marginBottom: '8px' }}>
                <DismissCircle24Regular />
                <Title3 style={{ color: '#D13438' }}>{t('feedback.incorrect', 'Sai rồi!')}</Title3>
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
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: 'var(--colorNeutralBackground3)',
          textAlign: 'left',
          marginTop: '8px',
        }}>
          <Caption1Strong style={{ color: 'var(--colorNeutralForeground3)', display: 'block', marginBottom: '4px' }}>
            {t('fill_blank.explanation', 'Giải thích')}
          </Caption1Strong>
          <span style={{ color: 'var(--colorNeutralForeground1)' }}>{question.explanation}</span>
        </div>
      )}
    </Card>
  );
};
