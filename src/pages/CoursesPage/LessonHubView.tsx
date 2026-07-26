import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Title3, Card } from '@fluentui/react-components';
import { Book24Regular, Board24Regular, ContactCard24Regular, Flash24Regular, QuizNew24Regular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import lessonsData from '@data/lessons/lessons.json';
import coursesData from '@data/courses/courses.json';
import { PageHeader } from '@components/PageHeader';
import { CardGrid } from '@components/CardGrid';
import { Language } from '@types';

export const LessonHubView: FC = () => {
  const { level, courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const { t: dt } = useTranslation('dashboard');
  const lang = i18n.language as Language;
  
  const lesson = lessonsData.find(l => l.id === lessonId);
  const title = lesson ? ((lesson.title as any)[lang] || lesson.title.ja) : '';
  const desc = lesson ? (lesson.description[lang] || lesson.description.vi) : '';

  const actions = [
    { title: dt('quick_access.vocabulary.title'), path: `/vocabulary?lesson=${lessonId}`, icon: <Book24Regular />, color: 'var(--colorPaletteGreenForeground1)', bg: 'var(--colorPaletteGreenBackground2)' },
    { title: dt('quick_access.grammar.title'), path: `/grammar?lesson=${lessonId}`, icon: <Board24Regular />, color: 'var(--colorPaletteYellowForeground1)', bg: 'var(--colorPaletteYellowBackground2)' },
    { title: dt('quick_access.kanji.title'), path: `/kanji?lesson=${lessonId}`, icon: <ContactCard24Regular />, color: 'var(--colorPaletteRedForeground1)', bg: 'var(--colorPaletteRedBackground2)' },
    { title: dt('quick_access.flashcard.title'), path: `/flashcards?lesson=${lessonId}`, icon: <Flash24Regular />, color: 'var(--colorPaletteBerryForeground1)', bg: 'var(--colorPaletteBerryBackground2)' },
    { title: dt('quick_access.quiz.title'), path: `/quiz?lesson=${lessonId}`, icon: <QuizNew24Regular />, color: 'var(--colorPalettePurpleForeground1)', bg: 'var(--colorPalettePurpleBackground2)' },
  ];

  const course = coursesData.find(c => c.id === courseId);
  const courseTitle = course ? ((course.title as any)[lang] || course.title.vi) : '';

  return (
    <div>
      <PageHeader 
        title={t('courses_page.lesson_number', { number: lesson?.number })}
        subtitle={`${title} - ${desc}`}
        breadcrumbItems={[
          { label: t('navigation.courses'), path: '/courses' },
          { label: level?.toUpperCase() || '', path: `/courses/${level}` },
          { label: courseTitle, path: `/courses/${level}/${courseId}` },
          { label: t('courses_page.lesson_number', { number: lesson?.number }) }
        ]}
      />
      
      <Title3 style={{ marginBottom: '16px', display: 'block' }}>{t('courses_page.learning_modules')}</Title3>
      <CardGrid minWidth={250}>
        {actions.map(action => (
          <Card key={action.title} onClick={() => { if(action.path !== '#') navigate(action.path); }} style={{ cursor: 'pointer', opacity: action.path === '#' ? 0.5 : 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24, display: 'flex' }}>{action.icon}</span>
              </div>
              <Title3>{action.title}</Title3>
            </div>
          </Card>
        ))}
      </CardGrid>
    </div>
  );
};
