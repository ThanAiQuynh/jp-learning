import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Title1 } from '@fluentui/react-components';
import { EmptyState } from '@components/EmptyState';
import { DocumentText24Regular } from '@fluentui/react-icons';

export const RadicalPage: FC = () => {
  const { t } = useTranslation('common');

  return (
    <div style={{ padding: '0 16px' }}>
      <Title1 as="h1" style={{ margin: '24px 0' }}>{t('navigation.radicals')}</Title1>
      <EmptyState 
        icon={<DocumentText24Regular />}
        title={t('navigation.radicals')}
        message="Dữ liệu bộ thủ đang được cập nhật. Vui lòng quay lại sau!"
      />
    </div>
  );
};
