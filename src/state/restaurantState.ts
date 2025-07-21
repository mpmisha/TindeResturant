import { atom, selector } from 'recoil';
import { Restaurant, Dish } from '../types/restaurant';

// Current restaurant data
export const restaurantState = atom<Restaurant | null>({
  key: 'restaurantState',
  default: null,
});

// Current card index being displayed
export const currentCardIndexState = atom<number>({
  key: 'currentCardIndexState',
  default: 0,
});

// User's selected dishes
export const selectedDishesState = atom<Dish[]>({
  key: 'selectedDishesState',
  default: [],
});

// Toggle between menu and summary views
export const showSummaryState = atom<boolean>({
  key: 'showSummaryState',
  default: false,
});

// Category being edited (null when not in edit mode)
export const editingCategoryState = atom<string | null>({
  key: 'editingCategoryState',
  default: null,
});

// Dishes ordered by category (Drink -> Starter -> Main course -> Desert -> Other)
export const orderedDishesState = selector<Dish[]>({
  key: 'orderedDishesState',
  get: ({ get }) => {
    const restaurant = get(restaurantState);
    const editingCategory = get(editingCategoryState);
    
    if (!restaurant || !restaurant.dishes) return [];

    let dishes = [...restaurant.dishes];
    
    // If we're editing a specific category, filter to only that category
    if (editingCategory) {
      dishes = dishes.filter(dish => dish.category === editingCategory);
    }

    const categoryOrder = ['Drink', 'Starter', 'Main course', 'Desert', 'Other'];
    
    return dishes.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category);
      const bIndex = categoryOrder.indexOf(b.category);
      
      // If categories are the same, maintain original order
      if (aIndex === bIndex) {
        return 0;
      }
      
      return aIndex - bIndex;
    });
  },
  cachePolicy_UNSTABLE: {
    eviction: 'most-recent',
  },
});

// Current dish being displayed
export const currentDishState = selector<Dish | null>({
  key: 'currentDishState',
  get: ({ get }) => {
    const dishes = get(orderedDishesState);
    const currentIndex = get(currentCardIndexState);
    
    return dishes[currentIndex] || null;
  },
});

// Check if all dishes have been swiped
export const isMenuCompleteState = selector<boolean>({
  key: 'isMenuCompleteState',
  get: ({ get }) => {
    const dishes = get(orderedDishesState);
    const currentIndex = get(currentCardIndexState);
    
    return currentIndex >= dishes.length;
  },
});

// Total price of selected dishes
export const totalPriceState = selector<number>({
  key: 'totalPriceState',
  get: ({ get }) => {
    const selectedDishes = get(selectedDishesState);
    
    return selectedDishes.reduce((total, dish) => total + dish.price, 0);
  },
});

// Remaining dishes count
export const remainingDishesCountState = selector<number>({
  key: 'remainingDishesCountState',
  get: ({ get }) => {
    const dishes = get(orderedDishesState);
    const currentIndex = get(currentCardIndexState);
    
    return Math.max(0, dishes.length - currentIndex);
  },
});

// Check if we're currently in category edit mode
export const isEditingCategoryState = selector<boolean>({
  key: 'isEditingCategoryState',
  get: ({ get }) => {
    const editingCategory = get(editingCategoryState);
    return editingCategory !== null;
  },
});
