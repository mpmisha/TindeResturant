import React from 'react';
import { useRecoilValue } from 'recoil';
import { remainingDishesCountState, selectedDishesState, orderedDishesState, isEditingCategoryState, editingCategoryState } from '../../state/restaurantState';
import styles from './ProgressBar.module.scss';

const ProgressBar: React.FC = () => {
  const remainingCount = useRecoilValue(remainingDishesCountState);
  const selectedDishes = useRecoilValue(selectedDishesState);
  const totalDishes = useRecoilValue(orderedDishesState).length;
  const isEditingCategory = useRecoilValue(isEditingCategoryState);
  const editingCategory = useRecoilValue(editingCategoryState);

const processedCount = totalDishes - remainingCount;
const progressPercentage = totalDishes > 0 ? (processedCount / totalDishes) * 100 : 0;

  return (
    <div className={styles.progressBar}>
      <div className={styles.progressIndicator} style={{ width: `${progressPercentage}%` }}></div>
      <div className={styles.progressText}>
      {isEditingCategory 
                ? `${processedCount}/${totalDishes}`
                : `${processedCount}/${totalDishes}`}
      </div>
    </div>
  );
};

export default ProgressBar;
