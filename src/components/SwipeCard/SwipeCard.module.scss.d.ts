export interface Styles {
  swipeCard: string;
  active: string;
  card: string;
  imageContainer: string;
  dishImage: string;
  priceTag: string;
  price: string;
  content: string;
  dishName: string;
  category: string;
  categoryText: string;
  descriptionContainer: string;
  description: string;
  expanded: string;
  expandHint: string;
  swipeIndicator: string;
  leftIndicator: string;
  rightIndicator: string;
  top: string;
  middle: string;
  back: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
