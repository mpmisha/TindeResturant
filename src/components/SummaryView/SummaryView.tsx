import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Text } from '@fluentui/react-text';
import { Card } from '@fluentui/react-card';
import { Divider } from '@fluentui/react-divider';
import { Button } from '@fluentui/react-button';
import { DismissRegular, EditRegular } from '@fluentui/react-icons';
import { 
  selectedDishesState, 
  totalPriceState,
  restaurantState,
  editingCategoryState,
  currentCardIndexState,
  showSummaryState
} from '../../state/restaurantState';
import { getImageWithFallback, formatPrice } from '../../utils/restaurantLoader';
import styles from './SummaryView.module.scss';

const SummaryView: React.FC = () => {
  const selectedDishes = useRecoilValue(selectedDishesState);
  const totalPrice = useRecoilValue(totalPriceState);
  const restaurant = useRecoilValue(restaurantState);
  
  const setSelectedDishes = useSetRecoilState(selectedDishesState);
  const setEditingCategory = useSetRecoilState(editingCategoryState);
  const setCurrentCardIndex = useSetRecoilState(currentCardIndexState);
  const setShowSummary = useSetRecoilState(showSummaryState);

  const handleRemoveDish = (dishToRemove: typeof selectedDishes[0], categoryIndex: number) => {
    setSelectedDishes(prev => {
      const newDishes = [...prev];
      // Find all dishes of the same category
      const categoryDishes = prev.filter(dish => dish.category === dishToRemove.category);
      // Find the global index of the dish to remove within the selected dishes array
      const dishToRemoveInCategory = categoryDishes[categoryIndex];
      const globalIndex = prev.findIndex(dish => dish === dishToRemoveInCategory);
      
      if (globalIndex !== -1) {
        newDishes.splice(globalIndex, 1);
      }
      return newDishes;
    });
  };

  const handleEditCategory = (category: string) => {
    setEditingCategory(category);
    setCurrentCardIndex(0);
    setShowSummary(false);
  };

  // Get all available categories from the restaurant
  const allAvailableCategories = restaurant?.dishes 
    ? [...new Set(restaurant.dishes.map(dish => dish.category))]
    : [];

  // If there are no categories available (no restaurant data), show empty state
  if (allAvailableCategories.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🤷‍♂️</div>
        <Text size={500} weight="semibold" className={styles.emptyTitle}>
          No menu available
        </Text>
        <Text size={400} className={styles.emptyMessage}>
          Unable to load the restaurant menu. Please try again.
        </Text>
      </div>
    );
  }

  // Group selected dishes by category
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
  
  // Get all categories (selected and unselected) in logical meal order
  const allCategories = allAvailableCategories.sort((a, b) => {
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
      </div>

      <div className={styles.itemsList}>
        {allCategories.map((category) => {
          const categoryDishes = dishesByCategory[category] || [];
          const hasItems = categoryDishes.length > 0;
          
          return (
            <div key={category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <Text size={500} weight="bold" className={styles.categoryTitle}>
                    {category}
                  </Text>
                  <Text size={300} className={styles.categoryCount}>
                    {hasItems 
                      ? `${categoryDishes.length} item${categoryDishes.length !== 1 ? 's' : ''}`
                      : 'No items selected'
                    }
                  </Text>
                </div>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<EditRegular />}
                  onClick={() => handleEditCategory(category)}
                  className={styles.editButton}
                  title={`Edit ${category} selection`}
                />
              </div>
              
              {hasItems && (
                <div className={styles.categoryItems}>
                  {categoryDishes.map((dish, index) => (
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
                        
                        <Button
                          appearance="subtle"
                          size="small"
                          icon={<DismissRegular />}
                          onClick={() => handleRemoveDish(dish, index)}
                          className={styles.removeButton}
                          title="Remove dish"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
