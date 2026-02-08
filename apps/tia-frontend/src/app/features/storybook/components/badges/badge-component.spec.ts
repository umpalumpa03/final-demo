import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge-component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';


const mockTranslations = {
  storybook: {
    badges: {
      sections: {
        variants: 'Variants',
        statusBadges: 'Status Badges',
        sizes: 'Sizes',
        countBadges: 'Count Badges',
        interactiveBadges: 'Interactive Badges (Dismissible)',
        pillBadges: 'Rounded/Pill Badges',
        dotIndicators: 'With Dot Indicators',
        badgeGroups: 'Badge Groups',
        badgeStates: 'Badge States',
        customColors: 'Custom Colors',
      },
      variants: {
        default: 'Default',
        secondary: 'Secondary',
        destructive: 'Destructive',
        outline: 'Outline',
      },
      sizes: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
      },
      countBadges: {
        messages: 'Messages',
        notifications: 'Notifications',
        updates: 'Updates',
        cartItems: 'Cart Items',
        unread: 'Unread',
        new: 'New',
      },
      dismissible: {
        tag1: 'Tag 1',
        tag2: 'Tag 2',
        tag3: 'Tag 3',
        tag4: 'Tag 4',
      },
      pillBadges: {
        pillShape: 'Pill Shape',
        category: 'Category',
        tag: 'Tag',
        angular: 'Angular',
        typescript: 'TypeScript',
        css: 'CSS',
        javascript: 'JavaScript',
      },
      badgeStates: {
        normal: 'Normal Badge',
        hoverMe: 'Hover Me',
        disabled: 'Disabled',
        selected: 'Selected',
        default: 'Default:',
        hovered: 'Hovered:',
        disabledLabel: 'Disabled:',
        selectedLabel: 'Selected:',
      },
      customColors: {
        pink: 'Pink',
        indigo: 'Indigo',
        teal: 'Teal',
        rose: 'Rose',
        cyan: 'Cyan',
        amber: 'Amber',
        lime: 'Lime',
        slate: 'Slate',
      },
      status: {
        active: 'Active',
        pending: 'Pending',
        inactive: 'Inactive',
        inProgress: 'In Progress',
        featured: 'Featured',
        premium: 'Premium',
        favorite: 'Favorite',
        done: 'Done',
        todo: 'Todo',
      },
      dot: {
        online: 'Online',
        away: 'Away',
        offline: 'Offline',
        live: 'Live',
      },
      skills: {
        javascript: 'JavaScript',
        react: 'React',
        angular: 'Angular',
        nodejs: 'Node.js',
        typescript: 'TypeScript',
        css: 'CSS',
        html: 'HTML',
      },
      categories: {
        technology: 'Technology',
        design: 'Design',
        marketing: 'Marketing',
      },
    },
  },
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of(mockTranslations);
  }
}

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BadgeComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
      ],
    }).compileComponents();

    translateService = TestBed.inject(TranslateService);
    await translateService.use('en').toPromise();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render component content', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('.badge-demo__title');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Variants');

    const badges = compiled.querySelectorAll('app-badges');
    expect(badges.length).toBeGreaterThan(0);
  });

  it('should render status badges section', () => {
    const compiled: HTMLElement = fixture.nativeElement;

    const titles = Array.from(compiled.querySelectorAll('.badge-demo__title')).map((t) =>
      (t.textContent ?? '').trim()
    );
    expect(titles).toContain('Status Badges');


    const statusBadgeTexts = ['Active', 'Pending', 'Inactive', 'In Progress', 'Featured', 'Premium'];
    const allBadges = compiled.querySelectorAll('app-badges');
    const statusBadges = Array.from(allBadges).filter((badge) => {
      const textContent = (badge.textContent ?? '').trim();
      return statusBadgeTexts.some((statusText) => textContent.includes(statusText));
    });
    
    expect(statusBadges.length).toBeGreaterThan(0);
  });


  describe('Interactive Badges (Dismissible)', () => {
    it('should remove badge when onDismissBadge is called', () => {
      const initialCount = component.dismissibleBadges().length;
      const firstBadgeId = component.dismissibleBadges()[0].id;

      component.onDismissBadge(firstBadgeId);
      fixture.detectChanges();

      expect(component.dismissibleBadges().length).toBe(initialCount - 1);
      expect(component.dismissibleBadges().find(badge => badge.id === firstBadgeId)).toBeUndefined();
    });
  });

  describe('Dot Badges', () => {
    it('should render dot badges section', () => {
      const compiled: HTMLElement = fixture.nativeElement;

      const titles = Array.from(compiled.querySelectorAll('.badge-demo__title')).map((t) =>
        (t.textContent ?? '').trim()
      );
      expect(titles).toContain('With Dot Indicators');
    });

    it('should render dot badges', () => {
      fixture.detectChanges();

      const allBadges = fixture.nativeElement.querySelectorAll('app-badges');
      const dotBadges = [...allBadges].filter((badge) => {
        const badgeElement = badge.querySelector('span[data-dot]');
        return badgeElement !== null;
      });
      
      expect(dotBadges.length).toBeGreaterThan(0);
    });
  });

  describe('onSelectedChange', () => {
    it('should update badge state when selected', () => {
      const initialStates = component.badgeStates();
      const firstStateId = initialStates[0].id;
      const initialSelected = initialStates[0].selected;

      component.onSelectedChange(firstStateId, true);
      fixture.detectChanges();

      const updatedStates = component.badgeStates();
      const updatedState = updatedStates.find(state => state.id === firstStateId);
      expect(updatedState?.selected).toBe(true);
      expect(updatedState?.selected).not.toBe(initialSelected);
    });
  });

  describe('onSimpleBadgeSelectedChange', () => {
    it('should update simpleBadgeSelected signal', () => {
      expect(component.simpleBadgeSelected()).toBe(false);

      component.onSimpleBadgeSelectedChange(true);
      fixture.detectChanges();

      expect(component.simpleBadgeSelected()).toBe(true);
    });
  });

  
});
