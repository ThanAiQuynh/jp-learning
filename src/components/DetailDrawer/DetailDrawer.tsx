import { FC, ReactNode } from 'react';
import { Drawer, DrawerBody, DrawerHeader, DrawerHeaderTitle, Button } from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';

export interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const DetailDrawer: FC<DetailDrawerProps> = ({ isOpen, onClose, title, children }) => {
  const { t } = useTranslation('common');

  return (
    <Drawer
      type="overlay"
      separator
      open={isOpen}
      onOpenChange={(_, { open }) => {
        if (!open) onClose();
      }}
      position="end"
      size="medium"
    >
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label={t('close', { defaultValue: 'Close' })}
              icon={<Dismiss24Regular />}
              onClick={onClose}
            />
          }
        >
          {title}
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody style={{ padding: '0 24px 24px' }}>
        {children}
      </DrawerBody>
    </Drawer>
  );
};
