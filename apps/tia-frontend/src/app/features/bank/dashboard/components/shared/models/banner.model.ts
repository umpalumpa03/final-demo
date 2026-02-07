export type ContentDirection = 'left' | 'center' | 'right';

export interface BannerSlide {
  imagePath: string;
  title: string;
  description: string;
  pageUrl: string;
  buttonText?: string;
  contentPosition: ContentDirection;
}