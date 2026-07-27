import { type FC } from 'react';
import { HeroWidget, ProgressWidget, QuickAccess } from '@features/dashboard/components';
import styles from './HomePage.module.scss';

export const HomePage: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.topSection}>
        <HeroWidget />
        <ProgressWidget />
      </div>
      <QuickAccess />
    </div>
  );
};

