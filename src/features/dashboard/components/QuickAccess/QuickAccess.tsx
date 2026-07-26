import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, Text, Title3 } from '@fluentui/react-components';
import { 
  Book24Regular, 
  Board24Regular, 
  Flash24Regular, 
  ContactCard24Regular,
  QuizNew24Regular
} from '@fluentui/react-icons';
import styles from './QuickAccess.module.scss';

export const QuickAccess: FC = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const currentLesson = 1;

  const items = [
    {
      id: 'vocab',
      title: t('quick_access.vocabulary.title'),
      desc: t('quick_access.vocabulary.desc', { lesson: currentLesson }),
      icon: <Book24Regular />,
      color: 'var(--colorPaletteGreenForeground1)',
      bg: 'var(--colorPaletteGreenBackground2)',
      path: '/vocabulary'
    },
    {
      id: 'grammar',
      title: t('quick_access.grammar.title'),
      desc: t('quick_access.grammar.desc', { lesson: currentLesson }),
      icon: <Board24Regular />,
      color: 'var(--colorPaletteYellowForeground1)',
      bg: 'var(--colorPaletteYellowBackground2)',
      path: '/grammar'
    },
    {
      id: 'kanji',
      title: t('quick_access.kanji.title'),
      desc: t('quick_access.kanji.desc', { lesson: currentLesson }),
      icon: <ContactCard24Regular />,
      color: 'var(--colorPaletteRedForeground1)',
      bg: 'var(--colorPaletteRedBackground2)',
      path: '/kanji'
    },
    {
      id: 'flashcard',
      title: t('quick_access.flashcard.title'),
      desc: t('quick_access.flashcard.desc'),
      icon: <Flash24Regular />,
      color: 'var(--colorPaletteBerryForeground1)',
      bg: 'var(--colorPaletteBerryBackground2)',
      path: '/flashcards'
    },
    {
      id: 'quiz',
      title: t('quick_access.quiz.title'),
      desc: t('quick_access.quiz.desc'),
      icon: <QuizNew24Regular />,
      color: 'var(--colorPalettePurpleForeground1)',
      bg: 'var(--colorPalettePurpleBackground2)',
      path: '/quiz'
    }
  ];

  return (
    <div className={styles.root}>
      <Title3 className={styles.heading}>{t('quick_access.title')}</Title3>
      <div className={styles.grid}>
        {items.map(item => (
          <Card
            key={item.id}
            className={styles.card}
            onClick={() => navigate(item.path)}
            orientation="horizontal"
          >
            <div className={styles.iconContainer} style={{ backgroundColor: item.bg, color: item.color }}>
              {item.icon}
            </div>
            <div className={styles.textContainer}>
              <Text className={styles.title}>{item.title}</Text>
              <Text className={styles.desc}>{item.desc}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
