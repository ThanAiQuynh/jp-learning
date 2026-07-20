import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Title1 } from '@fluentui/react-components';
import { Radical } from '@types';
import { getAllRadicals } from '@data';
import { RadicalGrid } from '../../features/radicals/components';

export const RadicalPage: FC = () => {
  const { t } = useTranslation('common');
  const [radicals, setRadicals] = useState<Radical[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRadicals = async () => {
      try {
        const data = await getAllRadicals();
        setRadicals(data);
      } catch (error) {
        console.error('Failed to load radicals', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRadicals();
  }, []);

  return (
    <div style={{ padding: '0 16px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title1 as="h1" style={{ margin: '24px 0' }}>{t('navigation.radicals')}</Title1>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <RadicalGrid items={radicals} />
      )}
    </div>
  );
};
