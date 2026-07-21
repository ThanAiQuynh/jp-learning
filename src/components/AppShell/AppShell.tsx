import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { 
  Button, 
  Title3, 
  Avatar,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  Tooltip,
} from '@fluentui/react-components';
import { 
  HomeRegular, HomeFilled, 
  MapRegular, MapFilled,
  BookRegular, BookFilled,
  BoardRegular, BoardFilled,
  LocalLanguage24Regular,
  ContactCardRegular, ContactCardFilled,
  WeatherMoonRegular, WeatherSunnyRegular,
  DocumentTextRegular, DocumentTextFilled,
  TextCaseTitleRegular,
  TextT24Regular,
} from '@fluentui/react-icons';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setTheme, toggleFurigana, toggleRomaji } from '@store/slices/progressSlice';
import { Language, Theme } from '@types';
import styles from './AppShell.module.scss';

export interface AppShellProps {
  children: ReactNode;
}

export const AppShell: FC<AppShellProps> = ({ children }) => {
  const { t, i18n } = useTranslation('common');
  const dispatch = useAppDispatch();
  const theme = useAppSelector(state => state.progress.settings.theme);
  const showFurigana = useAppSelector(state => state.progress.settings.showFurigana);
  const showRomaji = useAppSelector(state => state.progress.settings.showRomaji);

  const toggleThemeHandler = () => {
    dispatch(setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark));
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const navItems = [
    { to: '/', label: t('navigation.home'), icon: HomeRegular, activeIcon: HomeFilled },
    { to: '/courses', label: t('navigation.courses'), icon: MapRegular, activeIcon: MapFilled },
  ];

  const libraryItems = [
    { to: '/vocabulary', label: t('navigation.vocabulary'), icon: BookRegular, activeIcon: BookFilled },
    { to: '/grammar', label: t('navigation.grammar'), icon: BoardRegular, activeIcon: BoardFilled },
    { to: '/kanji', label: t('navigation.kanji'), icon: ContactCardRegular, activeIcon: ContactCardFilled },
    { to: '/radicals', label: t('navigation.radicals'), icon: DocumentTextRegular, activeIcon: DocumentTextFilled },
  ];

  const renderNavLinks = (items: any[]) => items.map(item => (
    <NavLink 
      key={item.to} 
      to={item.to}
      className={({ isActive }) => 
        isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
      }
      style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: '12px 16px', fontSize: '16px' }}
    >
      {({ isActive }) => (
        <>
          <item.icon style={{ marginRight: '12px', display: isActive ? 'none' : 'block' }} />
          <item.activeIcon style={{ marginRight: '12px', display: isActive ? 'block' : 'none' }} />
          {item.label}
        </>
      )}
    </NavLink>
  ));

  return (
    <div className={styles.root}>
      {/* Desktop Sidebar */}
      <nav className={styles.sidebar}>
        <div style={{ padding: '16px' }}>
          <Title3>{t('app_title')}</Title3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 8px', gap: '4px' }}>
          {renderNavLinks(navItems)}
          
          <div style={{ padding: '16px 8px 8px', fontSize: '12px', fontWeight: 'bold', color: 'var(--colorNeutralForeground3)' }}>
            {t('navigation.library').toUpperCase()}
          </div>
          
          {renderNavLinks(libraryItems)}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className={styles.main}>
        <header className={styles.header}>
          <Title3 style={{ fontSize: '18px' }}>{t('app_title')}</Title3>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>

            <Tooltip content={showFurigana ? t('toggle.hide_furigana', 'Ẩn furigana') : t('toggle.show_furigana', 'Hiện furigana')} relationship="label">
              <Button
                icon={<TextCaseTitleRegular />}
                appearance={showFurigana ? 'subtle' : 'transparent'}
                onClick={() => dispatch(toggleFurigana())}
                aria-label="Toggle furigana"
                style={{ opacity: showFurigana ? 1 : 0.4 }}
              />
            </Tooltip>

            <Tooltip content={showRomaji ? t('toggle.hide_romaji', 'Ẩn romaji') : t('toggle.show_romaji', 'Hiện romaji')} relationship="label">
              <Button
                icon={<TextT24Regular />}
                appearance={showRomaji ? 'subtle' : 'transparent'}
                onClick={() => dispatch(toggleRomaji())}
                aria-label="Toggle romaji"
                style={{ opacity: showRomaji ? 1 : 0.4 }}
              />
            </Tooltip>

            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button icon={<LocalLanguage24Regular />} appearance="transparent" />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => changeLanguage(Language.VI)}>Tiếng Việt</MenuItem>
                  <MenuItem onClick={() => changeLanguage(Language.EN)}>English</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
            <Button 
              icon={theme === Theme.Dark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />} 
              appearance="transparent" 
              onClick={toggleThemeHandler}
              aria-label={theme === Theme.Dark ? 'Switch to light mode' : 'Switch to dark mode'}
            />
            <Avatar name="User" />
          </div>
        </header>
        
        <main className={styles.content}>
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className={styles.bottomNav}>
          {[...navItems, ...libraryItems].map(item => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({ isActive }) => 
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon style={{ fontSize: '24px', marginBottom: '4px', display: isActive ? 'none' : 'block' }} />
                  <item.activeIcon style={{ fontSize: '24px', marginBottom: '4px', display: isActive ? 'block' : 'none' }} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
