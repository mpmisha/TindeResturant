export interface Styles {
  restaurantMenu: string;
  headerSection: string;
  mainContent: string;
  footerSection: string;
  doneButton: string;
  loadingContainer: string;
  errorContainer: string;
  errorTitle: string;
  errorMessage: string;
  errorHint: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
