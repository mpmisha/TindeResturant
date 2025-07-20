import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Spinner } from '@fluentui/react-spinner';
import { Text } from '@fluentui/react-text';
import { 
  restaurantState, 
  showSummaryState, 
  isMenuCompleteState,
  currentCardIndexState,
  selectedDishesState
} from '../state/restaurantState';
import { loadRestaurant } from '../utils/restaurantLoader';
import RestaurantHeader from '../components/RestaurantHeader/RestaurantHeader';
import SwipeInterface from '../components/SwipeInterface/SwipeInterface';
import SummaryView from '../components/SummaryView/SummaryView';
import CompletionMessage from '../components/CompletionMessage/CompletionMessage';
import styles from './RestaurantMenu.module.scss';

const RestaurantMenu: React.FC = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [restaurant, setRestaurant] = useRecoilState(restaurantState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const showSummary = useRecoilValue(showSummaryState);
  const isMenuComplete = useRecoilValue(isMenuCompleteState);
  
  // State reset functions
  const setCurrentCardIndex = useSetRecoilState(currentCardIndexState);
  const setSelectedDishes = useSetRecoilState(selectedDishesState);
  const setShowSummary = useSetRecoilState(showSummaryState);

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
  }, [restaurantId, setCurrentCardIndex, setSelectedDishes, setShowSummary, setRestaurant]);

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

  return (
    <div className={styles.restaurantMenu}>
      <RestaurantHeader restaurant={restaurant} />
      
      <main className={styles.mainContent}>
        {showSummary ? (
          <SummaryView />
        ) : isMenuComplete ? (
          <CompletionMessage />
        ) : (
          <SwipeInterface />
        )}
      </main>
    </div>
  );
};

export default RestaurantMenu;
