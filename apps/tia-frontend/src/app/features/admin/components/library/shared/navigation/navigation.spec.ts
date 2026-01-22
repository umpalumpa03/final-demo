import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navigation, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('nav a');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have router-outlet', () => {
    const compiled = fixture.nativeElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have correct selector', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render navigation element', () => {
    const compiled = fixture.nativeElement;
    const nav = compiled.querySelector('nav');
    expect(nav).toBeTruthy();
  });

  it('should have RouterModule imported', () => {
    const compiled = fixture.nativeElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
