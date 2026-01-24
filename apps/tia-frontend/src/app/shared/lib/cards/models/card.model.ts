export interface CardData {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  hasFooter?: boolean; 
  hasHover?: boolean;

}

export interface StatisticCardData {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}