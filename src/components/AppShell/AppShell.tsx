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

interface NavItemConfig {
  to: string;
  label: string;
  icon: FC<{ className?: string }>;
  activeIcon: FC<{ className?: string }>;
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

  const navItems: NavItemConfig[] = [
    { to: '/', label: t('navigation.home'), icon: HomeRegular, activeIcon: HomeFilled },
    { to: '/courses', label: t('navigation.courses'), icon: MapRegular, activeIcon: MapFilled },
  ];

  const libraryItems: NavItemConfig[] = [
    { to: '/vocabulary', label: t('navigation.vocabulary'), icon: BookRegular, activeIcon: BookFilled },
    { to: '/grammar', label: t('navigation.grammar'), icon: BoardRegular, activeIcon: BoardFilled },
    { to: '/kanji', label: t('navigation.kanji'), icon: ContactCardRegular, activeIcon: ContactCardFilled },
    { to: '/radicals', label: t('navigation.radicals'), icon: DocumentTextRegular, activeIcon: DocumentTextFilled },
  ];

  const renderSidebarLinks = (items: NavItemConfig[]) => items.map(item => (
    <NavLink 
      key={item.to} 
      to={item.to}
      className={({ isActive }) => 
        isActive ? `${styles.sidebarNavItem} ${styles.active}` : styles.sidebarNavItem
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={`${styles.navIcon} ${isActive ? styles.hidden : styles.visible}`} />
          <item.activeIcon className={`${styles.navIcon} ${isActive ? styles.visible : styles.hidden}`} />
          {item.label}
        </>
      )}
    </NavLink>
  ));

  return (
    <div className={styles.root}>
      {/* Desktop Sidebar */}
      <nav className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Title3>{t('app_title')}</Title3>
        </div>
        <div className={styles.sidebarNav}>
          {renderSidebarLinks(navItems)}
          
          <div className={styles.sidebarSectionHeader}>
            {t('navigation.library').toUpperCase()}
          </div>
          
          {renderSidebarLinks(libraryItems)}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className={styles.main}>
        <header className={styles.header}>
          <Title3 className={styles.headerTitle}>{t('app_title')}</Title3>
          <div className={styles.headerActions}>

            <Tooltip content={showFurigana ? t('toggle.hide_furigana', 'Ẩn furigana') : t('toggle.show_furigana', 'Hiện furigana')} relationship="label">
              <Button
                icon={<TextCaseTitleRegular />}
                appearance={showFurigana ? 'subtle' : 'transparent'}
                onClick={() => dispatch(toggleFurigana())}
                aria-label="Toggle furigana"
                className={`${styles.toggleBtn} ${showFurigana ? styles.active : styles.inactive}`}
              />
            </Tooltip>

            <Tooltip content={showRomaji ? t('toggle.hide_romaji', 'Ẩn romaji') : t('toggle.show_romaji', 'Hiện romaji')} relationship="label">
              <Button
                icon={<TextT24Regular />}
                appearance={showRomaji ? 'subtle' : 'transparent'}
                onClick={() => dispatch(toggleRomaji())}
                aria-label="Toggle romaji"
                className={`${styles.toggleBtn} ${showRomaji ? styles.active : styles.inactive}`}
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
                isActive ? `${styles.bottomNavItem} ${styles.active}` : styles.bottomNavItem
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`${styles.bottomNavIcon} ${isActive ? styles.hidden : styles.visible}`} />
                  <item.activeIcon className={`${styles.bottomNavIcon} ${isActive ? styles.visible : styles.hidden}`} />
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
