export interface Dish {
    id: number;
    name: string;
    shortDescription: string;
    fullDescription: string;
    price: number;
    category: "Drink" | "Main course" | "Starter" | "Desert" | "Other";
    image: string;
}
export interface Restaurant {
    id: string;
    name: string;
    logo: string;
    phoneNumber: string;
    dishes: Dish[];
}
export type SwipeDirection = 'left' | 'right';
export interface SwipeState {
    x: number;
    y: number;
    isDragging: boolean;
    startX: number;
    startY: number;
}
export interface SelectionSummary {
    selectedDishes: Dish[];
    totalPrice: number;
}
//# sourceMappingURL=restaurant.d.ts.map