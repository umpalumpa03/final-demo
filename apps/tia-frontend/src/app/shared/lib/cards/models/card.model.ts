export interface CardData {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  hasFooter?: boolean;
  hasHover?: boolean;
  width?: string;
  height?: string;
  flex?: string;
  minWidth?: string;
  maxWidth?: string;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  minHeight?: string;
  padding?: string;
  borderColor?: string;
  gap?: string;
  backgroundColor?: string;
  hasTransition?: boolean;
  customTransition?: string;
}

export interface StatisticCardData {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  height?: string;
   hasTransition?: boolean;
  customTransition?: string;
}

export interface CategoryCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconBgColor: string;
  count: number;
  transition?: string;
}
