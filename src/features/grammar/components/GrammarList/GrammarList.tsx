import { FC } from 'react';
import { GrammarPattern, Language } from '@types';
import { 
  Accordion, 
  AccordionItem, 
  AccordionHeader, 
  AccordionPanel,
  Button
} from '@fluentui/react-components';
import { ChevronRightRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import styles from './GrammarList.module.scss';

export interface GrammarListProps {
  items: GrammarPattern[];
  onDetailClick?: (item: GrammarPattern) => void;
}

export const GrammarList: FC<GrammarListProps> = ({ items, onDetailClick }) => {
  const { t, i18n } = useTranslation(['grammar', 'common']);
  const currentLang = i18n.language as Language;

  return (
    <div className={styles.root}>
      <Accordion collapsible>
        {items.map(item => (
          <AccordionItem value={item.id} key={item.id} className={styles.item}>
            <AccordionHeader size="large">
              <span className={styles.pattern}>{item.pattern}</span>
              <span className={styles.title}>
                {item.title[currentLang] || item.title.en}
              </span>
            </AccordionHeader>
            <AccordionPanel className={styles.panel}>
              <p>{item.explanation[currentLang] || item.explanation.en}</p>
              
              <div className={styles.examples}>
                {item.examples.slice(0, 2).map((ex: any, idx: number) => (
                  <div key={idx} className={styles.exampleItem}>
                    <div className={styles.ja}>{ex.ja}</div>
                    <div className={styles.translation}>
                      {ex.translation[currentLang] || ex.translation.en}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.actionContainer}>
                <Button 
                  appearance="primary" 
                  icon={<ChevronRightRegular />}
                  iconPosition="after"
                  onClick={() => onDetailClick?.(item)}
                >
                  {t('grammar:list.view_detail')}
                </Button>
              </div>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
