import React from 'react';
import { Text } from '@fluentui/react-text';
import { Restaurant } from '../../types/restaurant';
import styles from './RestaurantHeader.module.scss';

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({ restaurant }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <div className={styles.logoPlaceholder}>
            <Text size={600} weight="bold" className={styles.logoText}>
              {restaurant.name.substring(0, 2).toUpperCase()}
            </Text>
          </div>
        </div>
        
        <div className={styles.restaurantInfo}>
          <Text size={500} weight="semibold" className={styles.restaurantName}>
            {restaurant.name}
          </Text>
          {restaurant.phoneNumber && (
            <Text size={300} className={styles.phoneNumber}>
              {restaurant.phoneNumber}
            </Text>
          )}
        </div>
      </div>
    </header>
  );
};

export default RestaurantHeader;
