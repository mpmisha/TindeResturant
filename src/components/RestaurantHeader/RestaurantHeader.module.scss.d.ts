export interface Styles {
  header: string;
  container: string;
  logoSection: string;
  logoPlaceholder: string;
  logoText: string;
  restaurantInfo: string;
  restaurantName: string;
  phoneNumber: string;
  actions: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
