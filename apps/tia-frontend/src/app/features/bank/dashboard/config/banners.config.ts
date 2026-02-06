import { BannerSlide } from '../components/shared/models/banner.model';

export const bannerSlides: BannerSlide[] = [
  {
    imagePath: 'assets/images/banners/paybill-promo.png',
    title: 'TITLE TEST',
    description: 'TITLE DESC',
    pageUrl: '/bank/paybill/pay',
    buttonText: 'TEST BUTTON',
    contentPosition: 'left',
  },
  {
    imagePath: 'assets/images/banners/loans-promo.png',
    title: 'TITLE TEST',
    description: 'TITLE DESC',
    pageUrl: '/bank/products/loans',
    buttonText: 'TEST BUTTON',
    contentPosition: 'right',
  },
] as const;
