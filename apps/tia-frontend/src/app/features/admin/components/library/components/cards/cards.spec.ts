import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cards } from './cards';
import { BasicCard } from 'apps/tia-frontend/src/app/shared/lib/cards/basic-card/basic-card';
import { StatisticCard } from 'apps/tia-frontend/src/app/shared/lib/cards/statistic-card/statistic-card';
import { LibraryTitle } from '../../shared/library-title/library-title';
import { ButtonComponent } from '@tia/shared/lib/primitives/button/button';

describe('Cards', () => {
  let component: Cards;
  let fixture: ComponentFixture<Cards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cards, BasicCard, StatisticCard, LibraryTitle, ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Cards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Properties', () => {
    it('should have correct page metadata', () => {
      expect(component.pageTitle).toBe('Cards');
      expect(component.pageSubtitle).toBe(
        'Card components with various layouts and content types',
      );
    });

    it('should initialize signals with correct data', () => {
      expect(component.basicCards().length).toBe(3);
      expect(component.statisticsCards().length).toBe(4);
    });
  });

  describe('Basic Cards Data', () => {
    it('should have correct first card data', () => {
      const card = component.basicCards()[0];
      expect(card).toEqual({
        title: 'Card Title',
        subtitle: 'Card description goes here',
        content:
          'This is the main content area of the card. You can put any content here.',
      });
    });
  it('should have correct second card data', () => {
  const card = component.basicCards()[1];
  expect(card).toEqual({
    title: 'With Footer',
    subtitle: 'Card with action buttons',
    content: 'This card includes a footer with action buttons.',
    hasFooter: true,
  });
});

    it('should have correct third card data', () => {
      const card = component.basicCards()[2];
      expect(card).toEqual({
        title: 'Hover Effect',
        subtitle: 'Hover over this card',
        content: 'This card has hover effects applied.',
      });
    });
  });

  describe('Statistics Cards Data', () => {
    it('should have correct first card data', () => {
      const card = component.statisticsCards()[0];
      expect(card).toEqual({
        label: 'Total Revenue',
        value: '$45,231.89',
        change: '+20.1% from last month',
        changeType: 'positive',
        icon: 'images/svg/cards/dolar.svg',
      });
    });
  });

  describe('Template Rendering', () => {
    it('should render all required components', () => {
      expect(
        fixture.nativeElement.querySelector('app-library-title'),
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelectorAll('app-basic-card').length,
      ).toBe(3);
      expect(
        fixture.nativeElement.querySelectorAll('app-statistic-card').length,
      ).toBe(4);
    });

    it('should render section titles', () => {
      const sections = fixture.nativeElement.querySelectorAll(
        '.cards-section__title',
      );
      expect(sections[0].textContent).toBe('Basic Cards');
      expect(sections[1].textContent).toBe('Statistics Cards');
    });

    it('should render footer buttons in third card', () => {
      const buttons = fixture.nativeElement.querySelectorAll(
        '.card-footer app-button',
      );
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent.trim()).toBe('Cancel');
      expect(buttons[1].textContent.trim()).toBe('Submit');
    });

    it('should render card footer with correct class', () => {
      const footer = fixture.nativeElement.querySelector('.card-footer');
      expect(footer).toBeTruthy();
      expect(footer.hasAttribute('card-footer')).toBe(true);
    });
  });
});
