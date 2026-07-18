import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Title1, Body1 } from '@fluentui/react-components';
import { BookStar24Regular } from '@fluentui/react-icons';
import styles from './HeroWidget.module.scss';

export const HeroWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  
  return (
    <div className={styles.root}>
      <div className={styles.iconWrapper}>
        <BookStar24Regular />
      </div>
      <div className={styles.content}>
        <Title1 className={styles.greeting}>{t('hero.greeting')}</Title1>
        <Body1 className={styles.message}>{t('hero.message')}</Body1>
      </div>
    </div>
  );
};
