import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, Title3, ProgressBar } from '@fluentui/react-components';
import { TargetArrow24Regular } from '@fluentui/react-icons';
import styles from './ProgressWidget.module.scss';

export const ProgressWidget: FC = () => {
  const { t } = useTranslation('dashboard');

  return (
    <Card className={styles.root}>
      <CardHeader
        image={<TargetArrow24Regular style={{ color: 'var(--colorBrandForeground1)' }} />}
        header={<Title3>{t('progress.title')}</Title3>}
      />
      <div className={styles.content}>
        <div className={styles.progressItem}>
          <div className={styles.labelGroup}>
            <span>{t('progress.vocabulary')}</span>
            <span>{t('progress.learned', { current: 120, total: 500 })}</span>
          </div>
          <ProgressBar value={120} max={500} color="success" />
        </div>
        
        <div className={styles.progressItem}>
          <div className={styles.labelGroup}>
            <span>{t('progress.grammar')}</span>
            <span>{t('progress.learned', { current: 45, total: 100 })}</span>
          </div>
          <ProgressBar value={45} max={100} color="warning" />
        </div>

        <div className={styles.progressItem}>
          <div className={styles.labelGroup}>
            <span>{t('progress.kanji')}</span>
            <span>{t('progress.learned', { current: 30, total: 200 })}</span>
          </div>
          <ProgressBar value={30} max={200} color="error" />
        </div>
      </div>
    </Card>
  );
};
