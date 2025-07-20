export interface Styles {
  completionMessage: string;
  iconContainer: string;
  completionIcon: string;
  content: string;
  title: string;
  subtitle: string;
  selectionSummary: string;
  selectionText: string;
  selectionHint: string;
  noSelectionMessage: string;
  noSelectionText: string;
  noSelectionHint: string;
  actions: string;
  viewButton: string;
  thankYou: string;
  loading: string;
}

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
