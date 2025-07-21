import React from 'react';
import { useRecoilValue } from 'recoil';
import { Text } from '@fluentui/react-text';
import { Card } from '@fluentui/react-card';
import { Divider } from '@fluentui/react-divider';
import { 
  selectedDishesState, 
  totalPriceState,
  restaurantState
} from '../../state/restaurantState';
import { getImageWithFallback, formatPrice } from '../../utils/restaurantLoader';
import styles from './SummaryView.module.scss';

const SummaryView: React.FC = () => {
  const selectedDishes = useRecoilValue(selectedDishesState);
  const totalPrice = useRecoilValue(totalPriceState);
  const restaurant = useRecoilValue(restaurantState);

  if (selectedDishes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🤷‍♂️</div>
        <Text size={500} weight="semibold" className={styles.emptyTitle}>
          No dishes selected
        </Text>
        <Text size={400} className={styles.emptyMessage}>
          You didn't select any dishes from the menu. That's okay - maybe you're just browsing!
        </Text>
        <Text size={300} className={styles.emptyHint}>
          Feel free to scan the QR code again if you'd like to make another selection.
        </Text>
      </div>
    );
  }

  // Group dishes by category
  const dishesByCategory = selectedDishes.reduce((acc, dish) => {
    const category = dish.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(dish);
    return acc;
  }, {} as Record<string, typeof selectedDishes>);

  // Define the logical order for categories (meal flow order)
  const categoryOrder = ['Starter', 'Main course', 'Desert', 'Drink'];
  
  // Get categories in logical meal order
  const categories = Object.keys(dishesByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    // If both categories are in the predefined order, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // If only one category is in the predefined order, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // If neither category is in the predefined order, sort alphabetically
    return a.localeCompare(b);
  });

  return (
    <div className={styles.summaryView}>
      <div className={styles.header}>
        <Text size={600} weight="bold" className={styles.title}>
          Your Selection
        </Text>
        <Text size={400} className={styles.subtitle}>
          {selectedDishes.length} dish{selectedDishes.length !== 1 ? 'es' : ''} selected from {restaurant?.name}
        </Text>
      </div>

      <div className={styles.itemsList}>
        {categories.map((category) => (
          <div key={category} className={styles.categorySection}>
            <div className={styles.categoryHeader}>
              <Text size={500} weight="bold" className={styles.categoryTitle}>
                {category}
              </Text>
              <Text size={300} className={styles.categoryCount}>
                {dishesByCategory[category].length} item{dishesByCategory[category].length !== 1 ? 's' : ''}
              </Text>
            </div>
            
            <div className={styles.categoryItems}>
              {dishesByCategory[category].map((dish, index) => (
                <Card key={`${dish.id}-${index}`} className={styles.dishCard}>
                  <div className={styles.dishItem}>
                    <div className={styles.dishImageContainer}>
                      <img 
                        src={getImageWithFallback(dish.image, restaurant?.id)}
                        alt={dish.name}
                        className={styles.dishImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getImageWithFallback('', restaurant?.id);
                        }}
                      />
                    </div>
                    
                    <div className={styles.dishInfo}>
                      <Text size={400} weight="semibold" className={styles.dishName}>
                        {dish.name}
                      </Text>
                      <Text size={300} className={styles.dishDescription}>
                        {dish.shortDescription}
                      </Text>
                    </div>
                    
                    <div className={styles.dishPrice}>
                      <Text size={500} weight="semibold" className={styles.price}>
                        {formatPrice(dish.price)}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <Divider className={styles.divider} />
        <div className={styles.totalSection}>
          <div className={styles.totalRow}>
            <Text size={500} weight="semibold" className={styles.totalLabel}>
              Total Amount:
            </Text>
            <Text size={600} weight="bold" className={styles.totalPrice}>
              {formatPrice(totalPrice)}
            </Text>
          </div>
          <Text size={300} className={styles.disclaimer}>
            Please show this selection to your server to place your order.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;
