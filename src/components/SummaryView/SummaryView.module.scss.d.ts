export interface Styles {
  summaryView: string;
  header: string;
  title: string;
  subtitle: string;
  itemsList: string;
  dishCard: string;
  dishItem: string;
  dishImageContainer: string;
  dishImage: string;
  dishInfo: string;
  dishName: string;
  dishCategory: string;
  dishDescription: string;
  dishPrice: string;
  price: string;
  footer: string;
  divider: string;
  totalSection: string;
  totalRow: string;
  totalLabel: string;
  totalPrice: string;
  disclaimer: string;
  emptyState: string;
  emptyIcon: string;
  emptyTitle: string;
  emptyMessage: string;
  emptyHint: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
