import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge-component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

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

  it('should render sizes section', () => {
    const compiled: HTMLElement = fixture.nativeElement;

    const titles = Array.from(compiled.querySelectorAll('.badge-demo__title')).map((t) =>
      (t.textContent ?? '').trim()
    );
    expect(titles).toContain('Sizes');

  
    const sizeBadgeTexts = ['Small', 'Medium', 'Large'];
    const allBadges = compiled.querySelectorAll('app-badges');
    const sizeBadges = Array.from(allBadges).filter((badge) => {
      const textContent = (badge.textContent ?? '').trim();
      return sizeBadgeTexts.some((sizeText) => textContent.includes(sizeText));
    });
    
    expect(sizeBadges.length).toBeGreaterThan(0);
  });

  describe('Interactive Badges (Dismissible)', () => {
    it('should render dismissible badges section', () => {
      const compiled: HTMLElement = fixture.nativeElement;

      const titles = Array.from(compiled.querySelectorAll('.badge-demo__title')).map((t) =>
        (t.textContent ?? '').trim()
      );
      expect(titles).toContain('Interactive Badges (Dismissible)');
    });

    it('should have dismiss buttons for dismissible badges', () => {
      fixture.detectChanges();

      const dismissButtons = fixture.nativeElement.querySelectorAll('.badge__dismiss');
      expect(dismissButtons.length).toBeGreaterThan(0);
    });

    it('should remove badge when onDismissBadge is called', () => {
      const initialCount = component.dismissibleBadges().length;
      const firstBadgeId = component.dismissibleBadges()[0].id;

      component.onDismissBadge(firstBadgeId);
      fixture.detectChanges();

      expect(component.dismissibleBadges().length).toBe(initialCount - 1);
      expect(component.dismissibleBadges().find(badge => badge.id === firstBadgeId)).toBeUndefined();
    });

    it('should emit dismissed event when dismiss button is clicked', () => {
      fixture.detectChanges();

      const dismissButton = fixture.nativeElement.querySelector('.badge__dismiss') as HTMLButtonElement;
      expect(dismissButton).toBeTruthy();
      
      const initialCount = component.dismissibleBadges().length;
      dismissButton.click();
      fixture.detectChanges();

      expect(component.dismissibleBadges().length).toBe(initialCount - 1);
    });
  });

  describe('Rounded/Pill Badges', () => {
    it('should render pill badges section', () => {
      const compiled: HTMLElement = fixture.nativeElement;

      const titles = Array.from(compiled.querySelectorAll('.badge-demo__title')).map((t) =>
        (t.textContent ?? '').trim()
      );
      expect(titles).toContain('Rounded/Pill Badges');
    });


    it('should have pill badges with pill shape class', () => {
      fixture.detectChanges();

      const allBadges = fixture.nativeElement.querySelectorAll('app-badges');
      const pillBadges = [...allBadges].filter((badge) => {
        const badgeElement = badge.querySelector('span');
        return badgeElement?.className.includes('badge--pill');
      });
      
      expect(pillBadges.length).toBeGreaterThan(0);
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

    it('should have dot indicators with correct class', () => {
      fixture.detectChanges();

      const dotElements = fixture.nativeElement.querySelectorAll('.badge__dot');
      expect(dotElements.length).toBeGreaterThan(0);
    });
  });
});
