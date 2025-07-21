# TindeRestaurant - Application Guidelines

## General Concept

TindeRestaurant is a unique Tinder-like web application focused on selecting dishes from a specific restaurant's menu, rather than choosing between different restaurants. When users sit at a restaurant table, they scan a QR code that opens a restaurant-specific webapp in their mobile browser.

## User Experience Flow

### 1. Card-Based Menu Browsing

- **Card Layout**: Each dish appears as a swipeable card with:
  - Dish title at the top
  - Large dish photo in the center (55-60% of card height)
  - Price prominently displayed in the top-right corner
  - Short description at the bottom (clickable to reveal full details)
- **Card Dimensions**: Optimized for modern flagship phones (iPhone 16, Samsung Galaxy S24, etc.)
  - Width: 85-90% of viewport width
  - Height: ~65-70% of viewport height

### 2. Swipe Interactions

- **Swipe Directions**:
  - **Right Swipe** = "I want this dish" ✅
  - **Left Swipe** = "I don't want this dish" ❌
- **Natural Physics**: Cards follow finger movement during drag
- **Snap-back Behavior**: Incomplete swipes return the card to center
- **Fly-away Animation**: Complete swipes animate the card off-screen
- **Progressive Reveal**: Next card appears underneath as current card moves

### 3. Menu Navigation

- **Category Order**: Dishes are grouped and presented in logical restaurant order:
  1. **Drink** (Beverages, Wine, Coffee, etc.)
  2. **Starter** (Appetizers, Salads, Soups)
  3. **Main course** (Entrees, Primary dishes)
  4. **Desert** (Desserts, Sweet treats)
  5. **Other** (Sides, Extras, Specials)
- **"I'm Done" Button**: Always available, allows users to finish early
- **Completion Message**: Appears when all dishes have been swiped

### 4. Selection Summary

- **Final View**: Table-style layout showing all selected dishes
- **Item Display**: Small dish image, dish title, and price for each selection
- **Total Calculation**: Sum of all selected items
- **Final Step**: No return to menu browsing (terminal view)

## Technical Architecture

### Data Structure

#### Restaurant Configuration

```typescript
interface Restaurant {
  id: string;
  name: string;
  logo: string;
  phoneNumber: string;
  dishes: Dish[];
}
```

#### Dish Schema

```typescript
interface Dish {
  id: number;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: "Drink" | "Starter" | "Main course" | "Desert" | "Other";
  image: string;
}
```

### File Organization

```
src/
├── data/
│   ├── restaurants/
│   │   ├── restaurant-1.json
│   │   ├── restaurant-2.json
│   │   └── restaurant-3.json
│   └── images/
│       ├── restaurants/
│       ├── dishes/
│       └── placeholders/
│           └── dish-placeholder.jpg
```

### State Management (Recoil)

- **restaurantState**: Current restaurant data
- **selectedDishesState**: Array of user selections
- **currentCardIndexState**: Current dish being displayed
- **showSummaryState**: Toggle between menu and summary views
- **orderedDishesState**: Dishes sorted by category order

### URL Structure

- Restaurant-specific URLs: `/restaurant/:restaurantId`
- Example: `/restaurant/bella-vista`
- Invalid restaurant IDs handled gracefully

## Design Specifications

### Responsive Design

**Primary Target**: Modern flagship smartphones (2024-2025)

- iPhone 16 Series: 393px-440px width
- Samsung Galaxy S24 Series: 384px-412px width
- Google Pixel 8/9 Series: 412px width

**Responsive Breakpoints**:

- Primary: 375px-450px (flagship phones)
- Secondary: 451px-768px (tablets/landscape)
- Tertiary: 769px+ (desktop fallback)

### Visual Design

- **Typography**:
  - Dish titles: 20-24px
  - Prices: 18-20px (highlighted)
  - Descriptions: 16px
- **Touch Targets**: Minimum 48px (accessibility compliant)
- **Animations**: 60fps performance target
- **Images**: Retina-optimized with fallback placeholders

### Image Handling

- **Primary Images**: Stored in `/src/data/images/dishes/`
- **Fallback System**: Default placeholder for missing/broken images
- **Performance**: Lazy loading and optimization for mobile bandwidth
- **Format**: Progressive loading with blur-to-sharp transition

## Development Requirements

### Technology Stack

- **Frontend**: React + TypeScript
- **UI Components**: Fluent UI v2
- **State Management**: Recoil
- **Styling**: SCSS Modules
- **Build System**: Webpack
- **Testing**: Jest + React Testing Library

### Sample Data

**Test Restaurants**:

1. **Bella Vista** (Italian cuisine)
2. **Sakura Sushi** (Japanese cuisine)
3. **The Local Bistro** (American/International)

Each restaurant includes 12-15 dishes across all categories with realistic pricing and descriptions.

### Development Server

- **Local Testing**: `npm run dev` starts development server
- **URL Testing**: Support for `/restaurant/:restaurantId` routes
- **Mobile Testing**: Accessible via local IP for device testing
- **Hot Reloading**: Immediate updates during development

### Offline Capability

- **Service Worker**: Cache assets and restaurant data
- **Progressive Loading**: Essential content loads first
- **Graceful Degradation**: Functional without network after initial load

## Quality Assurance

### Performance Targets

- **First Contentful Paint**: <1.5s on 3G
- **Smooth Animations**: Consistent 60fps
- **Touch Response**: <100ms interaction feedback
- **Bundle Size**: Optimized for mobile networks

### Browser Support

- **Primary**: Safari (iOS), Chrome (Android)
- **Secondary**: Firefox, Edge mobile versions
- **Features**: Touch events, CSS transforms, modern JavaScript

### Accessibility

- **Touch Targets**: 48px minimum size
- **Color Contrast**: WCAG AA compliance
- **Screen Readers**: Proper ARIA labels
- **Keyboard Navigation**: Alternative to touch interaction
