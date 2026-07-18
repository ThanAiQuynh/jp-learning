import { FC } from 'react';
import { Title1, Title3, Button } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { CheckmarkCircle24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

export interface QuizSummaryProps {
  score: number;
  total: number;
  lessonId: string;
  onRetake: () => void;
}

export const QuizSummary: FC<QuizSummaryProps> = ({ score, total, onRetake }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('quiz');

  const percentage = Math.round((score / total) * 100);
  
  return (
    <div style={{ padding: '48px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <CheckmarkCircle24Regular style={{ fontSize: 64, color: 'var(--colorPaletteGreenForeground1)', marginBottom: 24 }} />
      <Title1 style={{ display: 'block', marginBottom: 16 }}>{t('summary.title')}</Title1>
      <Title3 style={{ display: 'block', marginBottom: 32 }}>
        {t('summary.score', { score, total })} ({percentage}%)
      </Title3>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Button appearance="primary" size="large" onClick={onRetake}>
          {t('summary.retake')}
        </Button>
        <Button size="large" onClick={() => navigate(-1)}>
          {t('summary.return')}
        </Button>
      </div>
    </div>
  );
};
