import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Text } from '@fluentui/react-text';
import { Card } from '@fluentui/react-card';
import { Divider } from '@fluentui/react-divider';
import { Button } from '@fluentui/react-button';
import { DismissRegular, EditRegular, ArrowSyncRegular } from '@fluentui/react-icons';
import { 
  selectedDishesState, 
  totalPriceState,
  restaurantState,
  editingCategoryState,
  currentCardIndexState,
  showSummaryState
} from '../../state/restaurantState';
import { useTable } from '../../contexts/TableContext';
import { getTableData } from '../../services/firebaseService';
import { getImageWithFallback, formatPrice } from '../../utils/restaurantLoader';
import styles from './SummaryView.module.scss';

const SummaryView: React.FC = () => {
  const selectedDishes = useRecoilValue(selectedDishesState);
  const totalPrice = useRecoilValue(totalPriceState);
  const restaurant = useRecoilValue(restaurantState);
  const { tableData, tableId, userId, isConnected, updateTableData } = useTable();
  
  const setSelectedDishes = useSetRecoilState(selectedDishesState);
  const setEditingCategory = useSetRecoilState(editingCategoryState);
  const setCurrentCardIndex = useSetRecoilState(currentCardIndexState);
  const setShowSummary = useSetRecoilState(showSummaryState);

  // Refresh table data manually
  const handleRefresh = async () => {
    if (tableId) {
      try {
        const freshTableData = await getTableData(tableId);
        updateTableData(freshTableData);
      } catch (error) {
        console.error('Failed to refresh table data:', error);
      }
    }
  };

  const handleRemoveDish = (dishToRemove: typeof selectedDishes[0], categoryIndex: number) => {
    setSelectedDishes(prev => {
      const newDishes = [...prev];
      const categoryDishes = prev.filter(dish => dish.category === dishToRemove.category);
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

  // Get all available dishes from the restaurant
  const allDishes = restaurant?.dishes || [];

  // Create a combined selection with user colors
  const getCombinedSelections = () => {
    if (!isConnected || !tableData || !restaurant) {
      // Single user mode - show only personal selections
      return selectedDishes.map(dish => ({
        dish,
        selectedBy: [{ 
          id: 'personal', 
          name: 'You', 
          color: '#FF5733' 
        }]
      }));
    }

    // Group mode - combine all selections
    const combinedMap = new Map();
    
    // Add personal selections first
    selectedDishes.forEach(dish => {
      const key = dish.id.toString();
      if (!combinedMap.has(key)) {
        combinedMap.set(key, {
          dish,
          selectedBy: []
        });
      }
      const currentUser = Object.values(tableData.users).find(user => user.id === userId);
      if (currentUser) {
        combinedMap.get(key).selectedBy.push(currentUser);
      }
    });

    // Add other users' selections
    if (tableData.selections) {
      Object.entries(tableData.selections).forEach(([dishId, userIds]) => {
        const dish = allDishes.find(d => d.id.toString() === dishId);
        if (dish) {
          if (!combinedMap.has(dishId)) {
            combinedMap.set(dishId, {
              dish,
              selectedBy: []
            });
          }
          
          userIds.forEach(userId => {
            const user = tableData.users[userId];
            if (user && !combinedMap.get(dishId).selectedBy.find((u: any) => u.id === userId)) {
              combinedMap.get(dishId).selectedBy.push(user);
            }
          });
        }
      });
    }

    return Array.from(combinedMap.values());
  };

  const combinedSelections = getCombinedSelections();

  // Group by category
  const selectionsByCategory = combinedSelections.reduce((acc, selection) => {
    const category = selection.dish.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(selection);
    return acc;
  }, {} as Record<string, typeof combinedSelections>);

  // Calculate total price (only for current user's selections)
  const personalTotal = selectedDishes.reduce((sum, dish) => sum + dish.price, 0);

  // Calculate group total if in group mode
  const groupTotal = isConnected && tableData ? 
    combinedSelections.reduce((sum, selection) => sum + (selection.dish.price * selection.selectedBy.length), 0) : 
    personalTotal;

  // Define the logical order for categories
  const categoryOrder = ['Starter', 'Main course', 'Desert', 'Drink'];
  const categories = Object.keys(selectionsByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  if (combinedSelections.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🍽️</div>
        <Text size={500} weight="semibold" className={styles.emptyTitle}>
          No selections yet
        </Text>
        <Text size={400} className={styles.emptyMessage}>
          {isConnected ? 
            "No one at your table has made any selections yet." :
            "You haven't selected any dishes yet."
          }
        </Text>
        {isConnected && (
          <Button
            appearance="outline"
            icon={<ArrowSyncRegular />}
            onClick={handleRefresh}
            className={styles.refreshButton}
          >
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.summaryView}>
      <div className={styles.header}>
        <Text size={600} weight="bold" className={styles.title}>
          {isConnected ? 'Table Selections' : 'Your Selection'}
        </Text>
        {isConnected && (
          <Button
            appearance="subtle"
            size="small"
            icon={<ArrowSyncRegular />}
            onClick={handleRefresh}
            className={styles.refreshButton}
            title="Refresh table selections"
          >
            Refresh
          </Button>
        )}
      </div>

      <div className={styles.itemsList}>
        {categories.map((category) => {
          const categorySelections = selectionsByCategory[category];
          
          return (
            <div key={category} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <div className={styles.categoryInfo}>
                  <Text size={500} weight="bold" className={styles.categoryTitle}>
                    {category}
                  </Text>
                  <Text size={300} className={styles.categoryCount}>
                    {categorySelections.length} item{categorySelections.length !== 1 ? 's' : ''}
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
              
              <div className={styles.categoryItems}>
                {categorySelections.map((selection: any, index: number) => (
                  <Card key={`${selection.dish.id}-${index}`} className={styles.dishCard}>
                    <div className={styles.dishItem}>
                      <div className={styles.dishImageContainer}>
                        <img 
                          src={getImageWithFallback(selection.dish.image, restaurant?.id)}
                          alt={selection.dish.name}
                          className={styles.dishImage}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getImageWithFallback('', restaurant?.id);
                          }}
                        />
                      </div>
                      
                      <div className={styles.dishInfo}>
                        <Text size={400} weight="semibold" className={styles.dishName}>
                          {selection.dish.name}
                        </Text>
                        <Text size={300} className={styles.dishDescription}>
                          {selection.dish.shortDescription}
                        </Text>
                        
                        {/* User indicators */}
                        <div className={styles.userIndicators}>
                          {selection.selectedBy.map((user: any, userIndex: number) => (
                            <div key={user.id} className={styles.userIndicator}>
                              <div 
                                className={styles.userColor}
                                style={{ backgroundColor: user.color }}
                                title={user.name}
                              />
                              <Text size={200} className={styles.userName}>
                                {user.name}
                              </Text>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className={styles.dishPrice}>
                        <Text size={500} weight="semibold" className={styles.price}>
                          {formatPrice(selection.dish.price)}
                        </Text>
                        {selection.selectedBy.length > 1 && (
                          <Text size={200} className={styles.quantity}>
                            × {selection.selectedBy.length}
                          </Text>
                        )}
                      </div>
                      
                      {/* Only show remove button for user's own selections */}
                      {selectedDishes.some(dish => dish.id === selection.dish.id) && (
                        <Button
                          appearance="subtle"
                          size="small"
                          icon={<DismissRegular />}
                          onClick={() => handleRemoveDish(selection.dish, 0)}
                          className={styles.removeButton}
                          title="Remove dish"
                        />
                      )}
                    </div>
                    
                    {/* Color bar showing all users who selected this item */}
                    <div className={styles.colorBar}>
                      {selection.selectedBy.map((user: any, userIndex: number) => (
                        <div
                          key={user.id}
                          className={styles.colorSegment}
                          style={{ 
                            backgroundColor: user.color,
                            width: `${100 / selection.selectedBy.length}%`
                          }}
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <Divider className={styles.divider} />
        <div className={styles.totalSection}>
          {isConnected && (
            <div className={styles.totalRow}>
              <Text size={400} weight="semibold" className={styles.totalLabel}>
                Table Total:
              </Text>
              <Text size={500} weight="bold" className={styles.totalPrice}>
                {formatPrice(groupTotal)}
              </Text>
            </div>
          )}
          <div className={styles.totalRow}>
            <Text size={400} weight="semibold" className={styles.totalLabel}>
              Your Total:
            </Text>
            <Text size={500} weight="bold" className={styles.totalPrice}>
              {formatPrice(personalTotal)}
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
