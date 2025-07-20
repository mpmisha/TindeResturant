export interface Styles {
  restaurantMenu: string;
  mainContent: string;
  loadingContainer: string;
  errorContainer: string;
  errorTitle: string;
  errorMessage: string;
  errorHint: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
