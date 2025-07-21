import { Restaurant } from '../types/restaurant';
import bellaVistaData from '../data/restaurants/bella-vista.json';
import sakuraSushiData from '../data/restaurants/sakura-sushi.json';
import localBistroData from '../data/restaurants/local-bistro.json';

// Restaurant data map
const restaurantData: Record<string, Restaurant> = {
  'bella-vista': bellaVistaData as Restaurant,
  'sakura-sushi': sakuraSushiData as Restaurant,
  'local-bistro': localBistroData as Restaurant,
};

// Default placeholder image path
export const PLACEHOLDER_IMAGE = '/images/placeholders/dish-placeholder.jpg';

/**
 * Load restaurant data by ID
 * @param restaurantId - The restaurant identifier
 * @returns Restaurant data or null if not found
 */
export const loadRestaurant = async (restaurantId: string): Promise<Restaurant | null> => {
  try {
    const restaurant = restaurantData[restaurantId];
    return restaurant || null;
  } catch (error) {
    console.error(`Failed to load restaurant data for ${restaurantId}:`, error);
    return null;
  }
};

/**
 * Get all available restaurant IDs
 * @returns Array of restaurant IDs
 */
export const getAvailableRestaurants = (): string[] => {
  return Object.keys(restaurantData);
};

/**
 * Get image path with fallback to placeholder
 * @param imagePath - Original image path
 * @param restaurantId - Restaurant identifier for constructing the full path
 * @returns Image path or placeholder if image doesn't exist
 */
export const getImageWithFallback = (imagePath: string, restaurantId?: string): string => {
  if (!imagePath || imagePath.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }
  
  // If no restaurant ID provided, return placeholder
  if (!restaurantId) {
    return PLACEHOLDER_IMAGE;
  }
  
  // Construct the full path: /images/dishes/<restaurant_name>/<image_path>
  return `/images/dishes/${restaurantId}/${imagePath}`;
};

/**
 * Format price for display
 * @param price - Price as number
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Sort dishes by category in the correct order
 * @param dishes - Array of dishes to sort
 * @returns Sorted array of dishes
 */
export const sortDishesByCategory = (dishes: any[]) => {
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
};
