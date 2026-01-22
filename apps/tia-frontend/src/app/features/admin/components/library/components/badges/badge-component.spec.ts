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
});
