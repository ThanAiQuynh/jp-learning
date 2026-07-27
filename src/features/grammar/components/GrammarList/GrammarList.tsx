import { FC, useRef } from 'react';
import { GrammarPattern } from '@types';
import { 
  Accordion, 
  AccordionItem, 
  AccordionHeader, 
  AccordionPanel,
  Button
} from '@fluentui/react-components';
import { ChevronRightRegular } from '@fluentui/react-icons';
import { useTranslation } from 'react-i18next';
import { useVirtualizer } from '@tanstack/react-virtual';
import { getLocalizedText, getNormalizedLanguage } from '@utils/i18n';
import styles from './GrammarList.module.scss';
import { formatGrammarPattern } from '../../utils';

export interface GrammarListProps {
  items: GrammarPattern[];
  onDetailClick?: (item: GrammarPattern) => void;
}

export const GrammarList: FC<GrammarListProps> = ({ items, onDetailClick }) => {
  const { t, i18n } = useTranslation(['grammar', 'common']);
  const currentLang = i18n.language;
  const normalizedLang = getNormalizedLanguage(currentLang);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 85,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className={styles.scrollContainer}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          if (!item) return null;

          return (
            <div
              key={item.id}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className={styles.itemWrapper}>
                <Accordion collapsible>
                  <AccordionItem value={item.id} className={styles.item}>
                    <AccordionHeader size="large">
                      <span className={styles.pattern}>{formatGrammarPattern(item.pattern, normalizedLang)}</span>
                      <span className={styles.title}>
                        {getLocalizedText(item.title, currentLang)}
                      </span>
                    </AccordionHeader>
                    <AccordionPanel className={styles.panel}>
                      <p>{getLocalizedText(item.explanation, currentLang)}</p>
                      
                      <div className={styles.examples}>
                        {item.examples.slice(0, 2).map((ex: any, idx: number) => (
                          <div key={idx} className={styles.exampleItem}>
                            <div className={styles.ja}>{ex.ja}</div>
                            <div className={styles.translation}>
                              {getLocalizedText(ex.translation, currentLang)}
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
                </Accordion>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
