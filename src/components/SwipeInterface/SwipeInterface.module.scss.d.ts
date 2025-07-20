export interface Styles {
  swipeInterface: string;
  progressSection: string;
  progressText: string;
  cardContainer: string;
  cardStack: string;
  topCard: string;
  middleCard: string;
  backCard: string;
  actionSection: string;
  doneButton: string;
  swipeHints: string;
  hintItem: string;
  swipeIcon: string;
  hintText: string;
  emptyState: string;
  emptyTitle: string;
  emptyMessage: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
