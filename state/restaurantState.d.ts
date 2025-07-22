import { Restaurant, Dish } from '../types/restaurant';
export declare const restaurantState: import("recoil").RecoilState<Restaurant | null>;
export declare const currentCardIndexState: import("recoil").RecoilState<number>;
export declare const selectedDishesState: import("recoil").RecoilState<Dish[]>;
export declare const showSummaryState: import("recoil").RecoilState<boolean>;
export declare const editingCategoryState: import("recoil").RecoilState<string | null>;
export declare const orderedDishesState: import("recoil").RecoilValueReadOnly<Dish[]>;
export declare const currentDishState: import("recoil").RecoilValueReadOnly<Dish | null>;
export declare const isMenuCompleteState: import("recoil").RecoilValueReadOnly<boolean>;
export declare const totalPriceState: import("recoil").RecoilValueReadOnly<number>;
export declare const remainingDishesCountState: import("recoil").RecoilValueReadOnly<number>;
export declare const isEditingCategoryState: import("recoil").RecoilValueReadOnly<boolean>;
//# sourceMappingURL=restaurantState.d.ts.map