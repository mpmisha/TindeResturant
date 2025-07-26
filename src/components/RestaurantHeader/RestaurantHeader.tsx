import React from 'react';
import { Text } from '@fluentui/react-text';
import { useSetRecoilState } from 'recoil';
import { Restaurant } from '../../types/restaurant';
import { currentCardIndexState, selectedDishesState, showSummaryState } from '../../state/restaurantState';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';
import styles from './RestaurantHeader.module.scss';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
  const setCurrentCardIndex = useSetRecoilState(currentCardIndexState);
  const setSelectedDishes = useSetRecoilState(selectedDishesState);
  const setShowSummary = useSetRecoilState(showSummaryState);

  const handleLogoClick = () => {
    // Reset to home screen - clear all state and start over
    setCurrentCardIndex(0);
    setSelectedDishes([]);
    setShowSummary(false);
  };

  const handlePhoneClick = () => {
    if (restaurant.phoneNumber) {
      // Initiate phone call
      window.location.href = `tel:${restaurant.phoneNumber}`;
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className={styles.logoPlaceholder}>
            <Text size={600} weight="bold" className={styles.logoText}>
              {restaurant.name.substring(0, 2).toUpperCase()}
            </Text>
          </div>
        </div>
        
        <div className={styles.restaurantInfo}>
          <Text size={500} weight="semibold" className={styles.restaurantName} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            {restaurant.name}
          </Text>
          {restaurant.phoneNumber && (
            <Text size={300} className={styles.phoneNumber} onClick={handlePhoneClick} style={{ cursor: 'pointer' }}>
              {restaurant.phoneNumber}
            </Text>
          )}
        </div>
        
        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default RestaurantHeader;
