import { type FC } from 'react';
import { HeroWidget } from '@features/dashboard/components/HeroWidget/HeroWidget';
import { ProgressWidget } from '@features/dashboard/components/ProgressWidget/ProgressWidget';
import { QuickAccess } from '@features/dashboard/components/QuickAccess/QuickAccess';
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
