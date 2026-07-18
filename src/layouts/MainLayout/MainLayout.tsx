import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '@components/AppShell';

export const MainLayout: FC = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};
