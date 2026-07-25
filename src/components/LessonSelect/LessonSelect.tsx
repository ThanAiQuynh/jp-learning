import { FC } from 'react';
import { Select } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import lessonsData from '@data/lessons/lessons.json';
import { Language } from '@types';

export interface LessonSelectProps {
  value: string;
  onChange: (lessonId: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const LessonSelect: FC<LessonSelectProps> = ({ value, onChange, className, style }) => {
  const { i18n, t } = useTranslation('common');
  const lang = i18n.language as Language;

  return (
    <Select
      value={value}
      onChange={(_, data) => onChange(data.value)}
      className={className}
      style={style}
      aria-label={t('navigation.courses', 'Lesson')}
    >
      {lessonsData.map(l => {
        const title = (l.title as any)[lang] || l.title.vi || l.title.ja;
        return (
          <option key={l.id} value={l.id}>
            Bài {l.number}: {title}
          </option>
        );
      })}
    </Select>
  );
};
