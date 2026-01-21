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
});
