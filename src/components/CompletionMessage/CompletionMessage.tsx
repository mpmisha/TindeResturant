import React from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Text } from '@fluentui/react-text';
import { Button } from '@fluentui/react-button';
import { 
  showSummaryState,
  selectedDishesState,
  restaurantState
} from '../../state/restaurantState';
import styles from './CompletionMessage.module.scss';

const CompletionMessage: React.FC = () => {
  const setShowSummary = useSetRecoilState(showSummaryState);
  const selectedDishes = useRecoilValue(selectedDishesState);
  const restaurant = useRecoilValue(restaurantState);

  const handleViewSelections = () => {
    setShowSummary(true);
  };

  const selectionCount = selectedDishes.length;
  const hasSelections = selectionCount > 0;

  return (
    <div className={styles.completionMessage}>
      <div className={styles.iconContainer}>
        <div className={styles.completionIcon}>🎉</div>
      </div>
      
      <div className={styles.content}>
        <Text size={600} weight="bold" className={styles.title}>
          Menu Complete!
        </Text>
        
        <Text size={400} className={styles.subtitle}>
          You've gone through all the dishes at {restaurant?.name}
        </Text>
        
        {hasSelections ? (
          <div className={styles.selectionSummary}>
            <Text size={500} weight="semibold" className={styles.selectionText}>
              You selected {selectionCount} dish{selectionCount !== 1 ? 'es' : ''}
            </Text>
            <Text size={300} className={styles.selectionHint}>
              Ready to see your final selection?
            </Text>
          </div>
        ) : (
          <div className={styles.noSelectionMessage}>
            <Text size={400} className={styles.noSelectionText}>
              You didn't select any dishes this time
            </Text>
            <Text size={300} className={styles.noSelectionHint}>
              That's perfectly fine! Feel free to browse again anytime.
            </Text>
          </div>
        )}
      </div>
      
      <div className={styles.actions}>
        {hasSelections && (
          <Button 
            appearance="primary" 
            size="large"
            onClick={handleViewSelections}
            className={styles.viewButton}
          >
            View My Selections
          </Button>
        )}
        
        <Text size={200} className={styles.thankYou}>
          Thank you for using TindeRestaurant! 🍽️
        </Text>
      </div>
    </div>
  );
};

export default CompletionMessage;
