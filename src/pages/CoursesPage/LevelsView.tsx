import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title1, Card, Text } from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';

export const LevelsView: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  return (
    <div>
      <Title1 style={{ marginBottom: '24px', display: 'block' }}>{t('courses_page.select_level')}</Title1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {levels.map(lvl => (
          <Card key={lvl} onClick={() => navigate(`/courses/${lvl.toLowerCase()}`)} style={{ cursor: 'pointer', padding: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <Text size={800} weight="bold">{lvl}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
