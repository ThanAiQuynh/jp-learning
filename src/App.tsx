import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@store';
import { useAppSelector } from '@store/hooks';
import { MainLayout } from '@layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@components/ErrorBoundary/ErrorBoundary';
import '@i18n';
import '@styles/global.scss';

const LoadingFallback = () => {
  const { t } = useTranslation('common');
  return <div style={{ padding: '48px', textAlign: 'center' }}>{t('common.loading')}</div>;
};

// Lazy load pages
const HomePage = lazy(() => import('@pages/HomePage').then(module => ({ default: module.HomePage })));
const VocabularyPage = lazy(() => import('@pages/VocabularyPage').then(module => ({ default: module.VocabularyPage })));
const GrammarPage = lazy(() => import('@pages/GrammarPage').then(module => ({ default: module.GrammarPage })));
const KanjiPage = lazy(() => import('@pages/KanjiPage').then(module => ({ default: module.KanjiPage })));
const FlashcardPage = lazy(() => import('@pages/FlashcardPage').then(module => ({ default: module.FlashcardPage })));
const SearchPage = lazy(() => import('@pages/SearchPage').then(module => ({ default: module.SearchPage })));
const QuizPage = lazy(() => import('@pages/QuizPage').then(module => ({ default: module.QuizPage })));
const RadicalPage = lazy(() => import('@pages/RadicalPage').then(module => ({ default: module.RadicalPage })));

const LevelsPage = lazy(() => import('@pages/CoursesPage/LevelsView').then(module => ({ default: module.LevelsView })));
const CoursesPage = lazy(() => import('@pages/CoursesPage/CoursesView').then(module => ({ default: module.CoursesView })));
const LessonsPage = lazy(() => import('@pages/CoursesPage/LessonsView').then(module => ({ default: module.LessonsView })));
const LessonHubPage = lazy(() => import('@pages/CoursesPage/LessonHubView').then(module => ({ default: module.LessonHubView })));
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'vocabulary',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <VocabularyPage />
          </Suspense>
        ),
      },
      {
        path: 'grammar',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <GrammarPage />
          </Suspense>
        ),
      },
      {
        path: 'kanji',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <KanjiPage />
          </Suspense>
        ),
      },
      {
        path: 'radicals',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RadicalPage />
          </Suspense>
        ),
      },
      {
        path: 'courses',
        children: [
          { index: true, element: <Suspense fallback={<LoadingFallback />}><LevelsPage /></Suspense> },
          { path: ':level', element: <Suspense fallback={<LoadingFallback />}><CoursesPage /></Suspense> },
          { path: ':level/:courseId', element: <Suspense fallback={<LoadingFallback />}><LessonsPage /></Suspense> },
          { path: ':level/:courseId/:lessonId', element: <Suspense fallback={<LoadingFallback />}><LessonHubPage /></Suspense> },
        ]
      },
      {
        path: 'flashcards',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <FlashcardPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: 'quiz',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <QuizPage />
          </Suspense>
        ),
      },
      // Thêm các routes khác ở đây
    ],
  },
]);

function AppContent() {
  const theme = useAppSelector(state => state.progress.settings.theme);
  
  // Xử lý system theme
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} style={{ height: '100vh', width: '100vw' }}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </FluentProvider>
  );
}

function App() {
  return (
    <ReduxProvider store={store}>
      <AppContent />
    </ReduxProvider>
  );
}

export default App;
