import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from '@fluentui/react-button';
import { Text } from '@fluentui/react-text';
import { 
  orderedDishesState,
  currentCardIndexState,
  remainingDishesCountState,
  showSummaryState
} from '../../state/restaurantState';
import SwipeCard from '../SwipeCard/SwipeCard';
import styles from './SwipeInterface.module.scss';

const SwipeInterface: React.FC = () => {
  const dishes = useRecoilValue(orderedDishesState);
  const currentIndex = useRecoilValue(currentCardIndexState);
  const remainingCount = useRecoilValue(remainingDishesCountState);
  const setShowSummary = useSetRecoilState(showSummaryState);

  const handleImDone = () => {
    setShowSummary(true);
  };

  if (dishes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Text size={500} weight="semibold" className={styles.emptyTitle}>
          No dishes available
        </Text>
        <Text size={400} className={styles.emptyMessage}>
          This restaurant menu appears to be empty.
        </Text>
      </div>
    );
  }

  // Get current and next dishes for the stack effect
  const currentDish = dishes[currentIndex];
  const nextDish = dishes[currentIndex + 1];
  const afterNextDish = dishes[currentIndex + 2];

  return (
    <div className={styles.swipeInterface}>
      <div className={styles.progressSection}>
        <Text size={300} className={styles.progressText}>
          {remainingCount} dish{remainingCount !== 1 ? 'es' : ''} remaining
        </Text>
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.cardStack}>
          {/* Back card (third card) */}
          {afterNextDish && (
            <div className={styles.backCard}>
              <SwipeCard 
                dish={afterNextDish} 
                isActive={false}
                stackPosition="back"
              />
            </div>
          )}
          
          {/* Middle card (second card) */}
          {nextDish && (
            <div className={styles.middleCard}>
              <SwipeCard 
                dish={nextDish} 
                isActive={false}
                stackPosition="middle"
              />
            </div>
          )}
          
          {/* Top card (current active card) */}
          {currentDish && (
            <div className={styles.topCard}>
              <SwipeCard 
                dish={currentDish} 
                isActive={true}
                stackPosition="top"
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.actionSection}>
        <Button 
          appearance="primary" 
          size="large"
          onClick={handleImDone}
          className={styles.doneButton}
        >
          I'm Done
        </Button>
        
        <div className={styles.swipeHints}>
          <div className={styles.hintItem}>
            <div className={styles.swipeIcon}>👈</div>
            <Text size={200} className={styles.hintText}>Don't want</Text>
          </div>
          <div className={styles.hintItem}>
            <div className={styles.swipeIcon}>👉</div>
            <Text size={200} className={styles.hintText}>Want this!</Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeInterface;
