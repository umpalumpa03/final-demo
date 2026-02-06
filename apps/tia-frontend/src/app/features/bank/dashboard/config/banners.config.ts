import { BannerSlide } from '../components/shared/models/banner.model';

export const bannerSlides: BannerSlide[] = [
  {
    imagePath: 'images/png/dashboard/banners/paybill_banner.png',
    title: 'Paybill Test Title',
    description: 'Description for paybill blablablabla',
    pageUrl: '/bank/paybill/pay',
    buttonText: 'TEST BUTTON',
    contentPosition: 'right',
  },
  {
    imagePath: 'images/png/dashboard/banners/transfers_banner.png',
    title: 'Transfers Test Title',
    description: 'Description for trasfers blablablabla',
    pageUrl: '/bank/paybill/pay',
    buttonText: 'TEST BUTTON',
    contentPosition: 'left',
  },
  {
    imagePath: 'images/png/dashboard/banners/loans_banner.png',
    title: 'Loans blablablablabla',
    description: 'Description for loans blablablabla',
    pageUrl: '/bank/paybill/pay',
    buttonText: 'TEST BUTTON',
    contentPosition: 'right',
  },
] as const;
