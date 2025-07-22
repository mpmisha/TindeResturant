import { Restaurant } from '../types/restaurant';
export declare const PLACEHOLDER_IMAGE = "/images/placeholders/dish-placeholder.jpg";
/**
 * Load restaurant data by ID
 * @param restaurantId - The restaurant identifier
 * @returns Restaurant data or null if not found
 */
export declare const loadRestaurant: (restaurantId: string) => Promise<Restaurant | null>;
/**
 * Get all available restaurant IDs
 * @returns Array of restaurant IDs
 */
export declare const getAvailableRestaurants: () => string[];
/**
 * Get image path with fallback to placeholder
 * @param imagePath - Original image path
 * @param restaurantId - Restaurant identifier for constructing the full path
 * @returns Image path or placeholder if image doesn't exist
 */
export declare const getImageWithFallback: (imagePath: string, restaurantId?: string) => string;
/**
 * Format price for display
 * @param price - Price as number
 * @returns Formatted price string
 */
export declare const formatPrice: (price: number) => string;
/**
 * Sort dishes by category in the correct order
 * @param dishes - Array of dishes to sort
 * @returns Sorted array of dishes
 */
export declare const sortDishesByCategory: (dishes: any[]) => any[];
//# sourceMappingURL=restaurantLoader.d.ts.map