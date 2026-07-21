import { FC, useState, Fragment } from 'react';
import { Button, Title3, Caption1Strong } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { CheckmarkRegular, DismissRegular } from '@fluentui/react-icons';
import styles from './MatchingQuestion.module.scss';

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

  const getLeftClassName = (id: string) => {
    const classes = [styles.matchingItem, styles.jpText];
    if (matched[id] === 'correct') classes.push(styles.correct);
    else if (selectedLeft === id) classes.push(styles.selected);
    return classes.join(' ');
  };

  const getRightClassName = (id: string) => {
    const isWrong = wrongPair?.endsWith(`-${id}`) || (wrongPair?.startsWith(`${selectedLeft}-`) && wrongPair?.endsWith(id));
    const classes = [styles.matchingItem];
    if (matched[id] === 'correct') classes.push(styles.correct);
    else if (isWrong) classes.push(styles.wrong);
    else if (selectedLeft) classes.push(styles.dimmed);
    return classes.join(' ');
  };

  return (
    <div className={styles.root}>
      <div className={styles.headerArea}>
        <Caption1Strong className={styles.instructionText}>
          {t('matching.instruction', 'Chọn từ bên trái, rồi chọn nghĩa tương ứng bên phải')}
        </Caption1Strong>
        <Title3 className={styles.progressTitle}>
          {correctCount} / {pairs.length} {t('matching.matched', 'cặp đúng')}
        </Title3>
      </div>

      <div className={styles.grid}>
        {pairs.map((leftPair, idx) => {
          const rightPair = rightItems[idx];
          return (
            <Fragment key={leftPair.id}>
              <div className={getLeftClassName(leftPair.id)} onClick={() => handleLeftClick(leftPair.id)}>
                {matched[leftPair.id] === 'correct' && <CheckmarkRegular className={styles.matchedIcon} />}
                {leftPair.left}
              </div>
              {rightPair && (
                <div key={rightPair.id} className={getRightClassName(rightPair.id)} onClick={() => handleRightClick(rightPair.id)}>
                  {matched[rightPair.id] === 'correct' && <CheckmarkRegular className={styles.matchedIcon} />}
                  {rightPair.right}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {isAllMatched && (
        <div className={styles.completeContainer}>
          <div className={styles.completeBanner}>
            🎉 {t('matching.all_correct', 'Hoàn thành! Bạn đã nối đúng tất cả!')}
          </div>
          <Button appearance="primary" size="large" onClick={() => onComplete(correctCount, pairs.length)}>
            {t('matching.next', 'Tiếp tục')}
          </Button>
        </div>
      )}

      <div className={`${styles.hintContainer} ${!isAllMatched && selectedLeft ? styles.visible : ''}`}>
        <Caption1Strong className={styles.instructionText}>
          <DismissRegular style={{ marginRight: 4 }} />
          {t('matching.cancel_hint', 'Nhấn lại từ đã chọn để bỏ chọn')}
        </Caption1Strong>
      </div>
    </div>
  );
};
