import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Title1 } from '@fluentui/react-components';
import { Radical } from '@types';
import { getAllRadicals } from '@data';
import { RadicalGrid } from '../../features/radicals/components';

import styles from './RadicalPage.module.scss';

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
    <div className={styles.root}>
      <Title1 as="h1" className={styles.title}>{t('navigation.radicals')}</Title1>
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <RadicalGrid items={radicals} />
      )}
    </div>
  );
};
