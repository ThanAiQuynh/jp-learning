import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Title1, Body1, Button } from '@fluentui/react-components';
import { BookStar24Regular, Play24Filled } from '@fluentui/react-icons';
import styles from './HeroWidget.module.scss';

export const HeroWidget: FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.iconWrapper}>
        <BookStar24Regular />
      </div>
      <div className={styles.content}>
        <Title1 className={styles.greeting}>{t('hero.greeting', 'Chào mừng bạn trở lại!')}</Title1>
        <Body1 className={styles.message}>
          {t('hero.message', 'Học Minna no Nihongo mỗi ngày để duy trì thói quen học tập.')}
        </Body1>
        <div className={styles.actionGroup}>
          <Button 
            appearance="primary" 
            icon={<Play24Filled />} 
            size="large"
            className={styles.ctaButton}
            onClick={() => navigate('/courses/n5/course-1/lesson-01')}
          >
            {t('hero.resume_btn', 'Tiếp tục Bài 1')}
          </Button>
        </div>
      </div>
    </div>
  );
};
