export interface CardData {
  title: string;
  subtitle: string;
  content: string;
  hasFooter?: boolean; 
}

export interface StatisticCardData {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: string;
}

