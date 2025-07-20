import React, { useState, useRef, useCallback } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { Text } from '@fluentui/react-text';
import { Card } from '@fluentui/react-card';
import { 
  currentCardIndexState, 
  selectedDishesState 
} from '../../state/restaurantState';
import { Dish, SwipeDirection } from '../../types/restaurant';
import { getImageWithFallback, formatPrice } from '../../utils/restaurantLoader';
import styles from './SwipeCard.module.scss';

interface SwipeCardProps {
  dish: Dish;
  isActive: boolean;
  stackPosition: 'top' | 'middle' | 'back';
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isDragging: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ dish, isActive, stackPosition }) => {
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
  });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const setCurrentCardIndex = useSetRecoilState(currentCardIndexState);
  const setSelectedDishes = useSetRecoilState(selectedDishesState);

  const SWIPE_THRESHOLD = 100; // pixels
  const ROTATION_FACTOR = 0.1; // degrees per pixel

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isActive || isAnimating) return;
    
    const touch = e.touches[0];
    setTouchState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isDragging: true,
    });
  }, [isActive, isAnimating]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchState.isDragging || !isActive || isAnimating) return;
    
    const touch = e.touches[0];
    setTouchState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }));
  }, [touchState.isDragging, isActive, isAnimating]);

  const handleTouchEnd = useCallback(() => {
    if (!touchState.isDragging || !isActive || isAnimating) return;
    
    const deltaX = touchState.currentX - touchState.startX;
    const deltaY = touchState.currentY - touchState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Check if it's a significant swipe
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction: SwipeDirection = deltaX > 0 ? 'right' : 'left';
      handleSwipe(direction);
    } else {
      // Snap back to center
      setTouchState({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
      });
    }
  }, [touchState, isActive, isAnimating]);

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Add to selected dishes if swiped right (want)
    if (direction === 'right') {
      setSelectedDishes(prev => [...prev, dish]);
    }
    
    // Animate card off screen
    const cardElement = cardRef.current;
    if (cardElement) {
      const flyDirection = direction === 'right' ? 1 : -1;
      cardElement.style.transform = `translateX(${flyDirection * 100}vw) rotate(${flyDirection * 30}deg)`;
      cardElement.style.opacity = '0';
    }
    
    // Move to next card after animation
    setTimeout(() => {
      setCurrentCardIndex(prev => prev + 1);
      setTouchState({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
      });
      setIsAnimating(false);
    }, 300);
  }, [dish, setCurrentCardIndex, setSelectedDishes, isAnimating]);

  const toggleDescription = useCallback(() => {
    if (isActive) {
      setShowFullDescription(prev => !prev);
    }
  }, [isActive]);

  // Calculate transform based on touch state
  const deltaX = touchState.currentX - touchState.startX;
  const deltaY = touchState.currentY - touchState.startY;
  const rotation = deltaX * ROTATION_FACTOR;
  const opacity = Math.max(0.7, 1 - Math.abs(deltaX) / 200);

  const cardStyle: React.CSSProperties = isActive && touchState.isDragging ? {
    transform: `translateX(${deltaX}px) translateY(${deltaY}px) rotate(${rotation}deg)`,
    opacity: opacity,
    transition: 'none',
  } : {
    transform: '',
    opacity: 1,
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.swipeCard} ${styles[stackPosition]} ${isActive ? styles.active : ''}`}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card className={styles.card}>
        <div className={styles.imageContainer}>
          <img 
            src={getImageWithFallback(dish.image)}
            alt={dish.name}
            className={styles.dishImage}
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              // Prevent infinite error loops by only setting fallback once
              if (!img.src.includes('placeholder')) {
                img.src = getImageWithFallback('');
              }
            }}
          />
          <div className={styles.priceTag}>
            <Text size={400} weight="semibold" className={styles.price}>
              {formatPrice(dish.price)}
            </Text>
          </div>
        </div>
        
        <div className={styles.content}>
          <Text size={500} weight="semibold" className={styles.dishName}>
            {dish.name}
          </Text>
          
          <div className={styles.category}>
            <Text size={200} className={styles.categoryText}>
              {dish.category}
            </Text>
          </div>
          
          <div 
            className={styles.descriptionContainer}
            onClick={toggleDescription}
            role="button"
            tabIndex={isActive ? 0 : -1}
            aria-expanded={showFullDescription}
          >
            <Text 
              size={300} 
              className={`${styles.description} ${showFullDescription ? styles.expanded : ''}`}
            >
              {showFullDescription ? dish.fullDescription : dish.shortDescription}
            </Text>
            {isActive && (
              <Text size={200} className={styles.expandHint}>
                {showFullDescription ? 'Tap to collapse' : 'Tap for more details'}
              </Text>
            )}
          </div>
        </div>
      </Card>
      
      {/* Swipe direction indicators */}
      {isActive && touchState.isDragging && (
        <>
          <div 
            className={`${styles.swipeIndicator} ${styles.leftIndicator}`}
            style={{ opacity: deltaX < -50 ? Math.min(1, Math.abs(deltaX) / 100) : 0 }}
          >
            <Text size={600} weight="bold">✗</Text>
            <Text size={300}>Don't Want</Text>
          </div>
          <div 
            className={`${styles.swipeIndicator} ${styles.rightIndicator}`}
            style={{ opacity: deltaX > 50 ? Math.min(1, deltaX / 100) : 0 }}
          >
            <Text size={600} weight="bold">✓</Text>
            <Text size={300}>Want This!</Text>
          </div>
        </>
      )}
    </div>
  );
};

export default SwipeCard;
