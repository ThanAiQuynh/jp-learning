import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, Body1, Text } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { Language } from '@types';
import coursesData from '@data/courses/courses.json';
import i18n from '@i18n/index';
import { PageHeader } from '@components/PageHeader';
import { CardGrid } from '@components/CardGrid';
import { EmptyState } from '@components/EmptyState';
import { Search24Regular } from '@fluentui/react-icons';

export const CoursesView: FC = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  
  const courses = coursesData.filter(c => c.level.toLowerCase() === level);

  return (
    <div>
      <PageHeader 
        title={t('courses_page.courses_for_level', { level: level?.toUpperCase() })}
        breadcrumbItems={[
          { label: t('navigation.courses'), path: '/courses' },
          { label: t('courses_page.courses_for_level', { level: level?.toUpperCase() }) }
        ]}
      />
      
      {courses.length > 0 ? (
        <CardGrid minWidth={300}>
          {courses.map(course => {
            const lang = i18n.language as Language;
            const title = (course.title as any)[lang] || course.title.vi;
            const desc = (course.description as any)[lang] || course.description.vi;
            return (
              <Card key={course.id} onClick={() => navigate(`/courses/${level}/${course.id}`)} style={{ cursor: 'pointer' }}>
                <CardHeader 
                  header={<Text size={500} weight="semibold">{title}</Text>} 
                  description={<Body1>{desc}</Body1>}
                />
              </Card>
            );
          })}
        </CardGrid>
      ) : (
        <EmptyState 
          icon={<Search24Regular />}
          message={t('courses_page.no_courses', { defaultValue: 'No courses found.' })}
        />
      )}
    </div>
  );
};
