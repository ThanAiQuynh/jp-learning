import { FC, useState } from 'react';
import { Button, Title3, Caption1Strong } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { CheckmarkRegular, DismissRegular } from '@fluentui/react-icons';

export interface MatchingPair {
  id: string;
  left: string;   // Japanese word / pattern
  right: string;  // Meaning
}

export interface MatchingQuestionProps {
  pairs: MatchingPair[];
  onComplete: (correctCount: number, total: number) => void;
}

export const MatchingQuestion: FC<MatchingQuestionProps> = ({ pairs, onComplete }) => {
  const { t } = useTranslation('quiz');
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [wrongPair, setWrongPair] = useState<string | null>(null);

  // Shuffle right column once on mount
  const [rightItems] = useState(() => [...pairs].sort(() => Math.random() - 0.5));

  const correctCount = Object.values(matched).filter(v => v === 'correct').length;
  const isAllMatched = correctCount === pairs.length;

  const handleLeftClick = (id: string) => {
    if (matched[id]) return;
    setSelectedLeft(prev => prev === id ? null : id);
    setWrongPair(null);
  };

  const handleRightClick = (rightId: string) => {
    if (!selectedLeft) return;
    if (matched[rightId]) return;

    if (selectedLeft === rightId) {
      setMatched(prev => ({ ...prev, [rightId]: 'correct' }));
    } else {
      setWrongPair(`${selectedLeft}-${rightId}`);
      setTimeout(() => setWrongPair(null), 800);
    }
    setSelectedLeft(null);
  };

  const getLeftStyle = (id: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: matched[id] ? 'default' : 'pointer',
      textAlign: 'center',
      fontSize: '18px',
      fontFamily: 'Noto Sans JP, sans-serif',
      border: '2px solid',
      transition: 'all 0.2s',
    };
    if (matched[id] === 'correct') {
      return { ...base, borderColor: '#107C10', backgroundColor: '#DFF6DD', color: '#107C10', cursor: 'default' };
    }
    if (selectedLeft === id) {
      return { ...base, borderColor: 'var(--colorBrandBackground)', backgroundColor: 'var(--colorBrandBackgroundInverted)', color: 'var(--colorBrandForeground1)' };
    }
    return { ...base, borderColor: 'var(--colorNeutralStroke1)', backgroundColor: 'var(--colorNeutralBackground1)' };
  };

  const getRightStyle = (id: string): React.CSSProperties => {
    const isWrong = wrongPair?.endsWith(`-${id}`) || wrongPair?.startsWith(`${selectedLeft}-`) && wrongPair?.endsWith(id);
    const base: React.CSSProperties = {
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: matched[id] ? 'default' : 'pointer',
      textAlign: 'center',
      border: '2px solid',
      transition: 'all 0.2s',
    };
    if (matched[id] === 'correct') {
      return { ...base, borderColor: '#107C10', backgroundColor: '#DFF6DD', color: '#107C10', cursor: 'default' };
    }
    if (isWrong) {
      return { ...base, borderColor: '#D13438', backgroundColor: '#FDE7E9', color: '#D13438' };
    }
    if (selectedLeft) {
      return { ...base, borderColor: 'var(--colorNeutralStroke1)', backgroundColor: 'var(--colorNeutralBackground1)', opacity: 0.85 };
    }
    return { ...base, borderColor: 'var(--colorNeutralStroke1)', backgroundColor: 'var(--colorNeutralBackground1)' };
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Caption1Strong style={{ color: 'var(--colorNeutralForeground3)' }}>
          {t('matching.instruction', 'Chọn từ bên trái, rồi chọn nghĩa tương ứng bên phải')}
        </Caption1Strong>
        <Title3 style={{ display: 'block', marginTop: '8px' }}>
          {correctCount} / {pairs.length} {t('matching.matched', 'cặp đúng')}
        </Title3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pairs.map(pair => (
            <div key={pair.id} style={getLeftStyle(pair.id)} onClick={() => handleLeftClick(pair.id)}>
              {matched[pair.id] === 'correct' && <CheckmarkRegular style={{ marginRight: 8, color: '#107C10' }} />}
              {pair.left}
            </div>
          ))}
        </div>

        {/* Right column (shuffled) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rightItems.map(pair => (
            <div key={pair.id} style={getRightStyle(pair.id)} onClick={() => handleRightClick(pair.id)}>
              {matched[pair.id] === 'correct' && <CheckmarkRegular style={{ marginRight: 8, color: '#107C10' }} />}
              {pair.right}
            </div>
          ))}
        </div>
      </div>

      {isAllMatched && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <div style={{ color: '#107C10', fontSize: '18px', marginBottom: '16px' }}>
            🎉 {t('matching.all_correct', 'Hoàn thành! Bạn đã nối đúng tất cả!')}
          </div>
          <Button appearance="primary" size="large" onClick={() => onComplete(correctCount, pairs.length)}>
            {t('matching.next', 'Tiếp tục')}
          </Button>
        </div>
      )}

      {!isAllMatched && selectedLeft && (
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Caption1Strong style={{ color: 'var(--colorNeutralForeground3)' }}>
            <DismissRegular style={{ marginRight: 4 }} />
            {t('matching.cancel_hint', 'Nhấn lại từ đã chọn để bỏ chọn')}
          </Caption1Strong>
        </div>
      )}
    </div>
  );
};
