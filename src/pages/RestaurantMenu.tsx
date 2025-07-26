import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Spinner } from '@fluentui/react-spinner';
import { Text } from '@fluentui/react-text';
import { Button } from '@fluentui/react-button';
import { 
  restaurantState, 
  showSummaryState, 
  isMenuCompleteState,
  currentCardIndexState,
  selectedDishesState,
  editingCategoryState,
  isEditingCategoryState
} from '../state/restaurantState';
import { loadRestaurant } from '../utils/restaurantLoader';
import RestaurantHeader from '../components/RestaurantHeader/RestaurantHeader';
import SwipeInterface from '../components/SwipeInterface/SwipeInterface';
import SummaryView from '../components/SummaryView/SummaryView';
import CompletionMessage from '../components/CompletionMessage/CompletionMessage';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import Menu from '../components/Menu/Menu';
import { useTable } from '../contexts/TableContext';
import styles from './RestaurantMenu.module.scss';

const RestaurantMenu: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useRecoilState(restaurantState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const showSummary = useRecoilValue(showSummaryState);
  const isMenuComplete = useRecoilValue(isMenuCompleteState);
  const isEditingCategory = useRecoilValue(isEditingCategoryState);
  
  // State reset functions
  const setCurrentCardIndex = useSetRecoilState(currentCardIndexState);
  const setSelectedDishes = useSetRecoilState(selectedDishesState);
  const setShowSummary = useSetRecoilState(showSummaryState);
  const setEditingCategory = useSetRecoilState(editingCategoryState);

  // Handle category editing completion
  useEffect(() => {
    if (isMenuComplete && isEditingCategory) {
      // When category editing is complete, return to summary
      setEditingCategory(null);
      setShowSummary(true);
    }
  }, [isMenuComplete, isEditingCategory, setEditingCategory, setShowSummary]);

  useEffect(() => {
    const loadRestaurantData = async () => {
      if (!restaurantId) {
        setError('No restaurant ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Reset state when switching restaurants
        setCurrentCardIndex(0);
        setSelectedDishes([]);
        setShowSummary(false);
        setEditingCategory(null);
        
        const restaurantData = await loadRestaurant(restaurantId);
        
        if (!restaurantData) {
          setError(`Restaurant "${restaurantId}" not found`);
          setLoading(false);
          return;
        }

        setRestaurant(restaurantData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading restaurant:', err);
        setError('Failed to load restaurant data');
        setLoading(false);
      }
    };

    loadRestaurantData();
  }, [restaurantId, setCurrentCardIndex, setSelectedDishes, setShowSummary, setEditingCategory, setRestaurant]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" label="Loading restaurant menu..." />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className={styles.errorContainer}>
        <Text size={600} weight="semibold" className={styles.errorTitle}>
          Oops! Something went wrong
        </Text>
        <Text size={400} className={styles.errorMessage}>
          {error || 'Restaurant not found'}
        </Text>
        <Text size={300} className={styles.errorHint}>
          Please check the QR code and try again, or contact the restaurant staff.
        </Text>
      </div>
    );
  }

  const { isConnected } = useTable();

  return (
    <div className={styles.restaurantMenu}>
      <Menu />
      <div className={styles.headerSection}>
        <RestaurantHeader restaurant={restaurant} />
      </div>
      
      <main className={styles.mainContent}>
        {showSummary ? (
          <SummaryView />
        ) : isMenuComplete && !isEditingCategory ? (
          <CompletionMessage />
        ) : (
          <SwipeInterface />
        )}
      </main>

      {!showSummary && !isMenuComplete && (
<ProgressBar />
      )}
    </div>
  );
};

export default RestaurantMenu;
