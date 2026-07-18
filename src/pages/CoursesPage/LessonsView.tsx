import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Title3, Card, CardHeader, Badge } from '@fluentui/react-components';
import { Language } from '@types';
import { useTranslation } from 'react-i18next';
import coursesData from '@data/courses/courses.json';
import lessonsData from '@data/lessons/lessons.json';
import { PageHeader } from '@components/PageHeader';
import { CardGrid } from '@components/CardGrid';
import { EmptyState } from '@components/EmptyState';
import { Search24Regular } from '@fluentui/react-icons';

export const LessonsView: FC = () => {
  const { level, courseId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language as Language;
  
  const course = coursesData.find(c => c.id === courseId);
  const lessons = lessonsData.filter(l => l.courseId === courseId);

  return (
    <div>
      <PageHeader 
        title={course ? ((course.title as any)[lang] || course.title.vi) : ''}
        breadcrumbItems={[
          { label: t('navigation.courses'), path: '/courses' },
          { label: level?.toUpperCase() || '', path: `/courses/${level}` },
          { label: course ? ((course.title as any)[lang] || course.title.vi) : '' }
        ]}
      />
      
      {lessons.length > 0 ? (
        <CardGrid minWidth={250}>
          {lessons.map(lesson => {
            const title = (lesson.title as any)[lang] || lesson.title.ja;
            return (
              <Card key={lesson.id} onClick={() => navigate(`/courses/${level}/${courseId}/${lesson.id}`)} style={{ cursor: 'pointer' }}>
                <CardHeader 
                  header={<Title3>{t('courses_page.lesson_number', { number: lesson.number })}</Title3>} 
                  description={title}
                />
                <div style={{ padding: '0 12px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Badge color="success">{t('courses_page.vocab_count', { count: lesson.vocabCount })}</Badge>
                  <Badge color="warning">{t('courses_page.grammar_count', { count: lesson.grammarCount })}</Badge>
                  <Badge color="danger">{t('courses_page.kanji_count', { count: lesson.kanjiCount })}</Badge>
                </div>
              </Card>
            );
          })}
        </CardGrid>
      ) : (
        <EmptyState 
          icon={<Search24Regular />}
          message={t('courses_page.no_lessons', { defaultValue: 'No lessons found.' })}
        />
      )}
    </div>
  );
};
