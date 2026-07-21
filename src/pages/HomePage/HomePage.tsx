import { type FC } from 'react';
import { QuickAccess } from '@features/dashboard/components/QuickAccess/QuickAccess';
import styles from './HomePage.module.scss';

export const HomePage: FC = () => {
  return (
    <div className={styles.root}>
      <QuickAccess />
    </div>
  );
};
