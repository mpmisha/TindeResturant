import React from 'react';
import { useRecoilValue } from 'recoil';
import { Text } from '@fluentui/react-text';
import { 
  orderedDishesState,
  currentCardIndexState,
  remainingDishesCountState,
  editingCategoryState,
  isEditingCategoryState
} from '../../state/restaurantState';
import SwipeCard from '../SwipeCard/SwipeCard';
import styles from './SwipeInterface.module.scss';

const SwipeInterface: React.FC = () => {
  const dishes = useRecoilValue(orderedDishesState);
  const currentIndex = useRecoilValue(currentCardIndexState);
  const remainingCount = useRecoilValue(remainingDishesCountState);
  const editingCategory = useRecoilValue(editingCategoryState);
  const isEditingCategory = useRecoilValue(isEditingCategoryState);

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
          {isEditingCategory 
            ? `Editing ${editingCategory}: ${remainingCount} dish${remainingCount !== 1 ? 'es' : ''} remaining`
            : `${remainingCount} dish${remainingCount !== 1 ? 'es' : ''} remaining`
          }
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
    </div>
  );
};

export default SwipeInterface;
