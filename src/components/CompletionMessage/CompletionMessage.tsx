import React, { useEffect, useState } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Text } from '@fluentui/react-text';
import { Button } from '@fluentui/react-button';
import { Spinner } from '@fluentui/react-spinner';
import { 
  showSummaryState,
  selectedDishesState,
  restaurantState
} from '../../state/restaurantState';
import { useTable } from '../../contexts/TableContext';
import { updateSelections } from '../../services/firebaseService';
import styles from './CompletionMessage.module.scss';

const CompletionMessage: React.FC = () => {
  const setShowSummary = useSetRecoilState(showSummaryState);
  const selectedDishes = useRecoilValue(selectedDishesState);
  const restaurant = useRecoilValue(restaurantState);
  const { tableId, userId, isConnected } = useTable();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const selectionCount = selectedDishes.length;
  const hasSelections = selectionCount > 0;

  // Upload selections to Firebase when component mounts
  useEffect(() => {
    const uploadSelections = async () => {
      if (isConnected && tableId && userId && hasSelections && !uploaded) {
        setUploading(true);
        try {
          const selectedItemIds = selectedDishes.map(dish => dish.id.toString());
          await updateSelections(tableId, userId, selectedItemIds);
          setUploaded(true);
        } catch (error) {
          console.error('Failed to upload selections:', error);
        } finally {
          setUploading(false);
        }
      }
    };

    uploadSelections();
  }, [isConnected, tableId, userId, selectedDishes, hasSelections, uploaded]);

  const handleViewSelections = () => {
    setShowSummary(true);
  };

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

        {isConnected && uploading && (
          <div className={styles.uploadStatus}>
            <Spinner size="small" />
            <Text size={300}>Saving your selections...</Text>
          </div>
        )}

        {isConnected && uploaded && (
          <div className={styles.uploadStatus}>
            <Text size={300} className={styles.successText}>✓ Selections saved to your table!</Text>
          </div>
        )}
        
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
