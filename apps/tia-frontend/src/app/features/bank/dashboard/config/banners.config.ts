import { BannerSlide } from '../components/shared/models/banner.model';

export const bannerSlides: BannerSlide[] = [
  {
    imagePath: 'images/png/dashboard/banners/paybill_banner.png',
    title: 'dashboard.banners.paybills.title',
    description: 'dashboard.banners.paybills.description',
    pageUrl: '/bank/paybill/pay',
    buttonText: 'dashboard.banners.paybills.button',
    contentPosition: 'right',
  },
  {
    imagePath: 'images/png/dashboard/banners/transfers_banner.png',
    title: 'dashboard.banners.transfers.title',
    description: 'dashboard.banners.transfers.description',
    pageUrl: '/bank/transfers',
    buttonText: 'dashboard.banners.transfers.button',
    contentPosition: 'left',
  },
  {
    imagePath: 'images/png/dashboard/banners/loans_banner.png',
    title: 'dashboard.banners.loans.title',
    description: 'dashboard.banners.loans.description',
    pageUrl: '/bank/loans/all',
    buttonText: 'dashboard.banners.loans.button',
    contentPosition: 'right',
  },
];
