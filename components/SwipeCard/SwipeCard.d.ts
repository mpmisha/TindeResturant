import React from 'react';
import { Dish } from '../../types/restaurant';
interface SwipeCardProps {
    dish: Dish;
    isActive: boolean;
    stackPosition: 'top' | 'middle' | 'back';
}
declare const SwipeCard: React.FC<SwipeCardProps>;
export default SwipeCard;
//# sourceMappingURL=SwipeCard.d.ts.map