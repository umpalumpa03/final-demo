import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteLoader } from './route-loader';
import { RouteLoaderVariants } from '../models/route-loader.model';

describe('RouteLoader', () => {
  let component: RouteLoader;
  let fixture: ComponentFixture<RouteLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteLoader],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteLoader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default variant as TopBar', () => {
    expect(component.variant()).toBe(RouteLoaderVariants.TopBar);
  });

  it('should have default text', () => {
    expect(component.text()).toBe('Loading page content...');
  });

  it('should compute correct loader class for TopBar variant', () => {
    expect(component.loaderClass()).toBe('route-loader route-loader--top-bar');
  });

  it('should compute correct loader class for FullPage variant', () => {
    fixture.componentRef.setInput('variant', RouteLoaderVariants.FullPage);
    fixture.detectChanges();
    expect(component.loaderClass()).toBe('route-loader route-loader--full-page');
  });

  it('should compute correct loader class for Pulsing variant', () => {
    fixture.componentRef.setInput('variant', RouteLoaderVariants.Pulsing);
    fixture.detectChanges();
    expect(component.loaderClass()).toBe('route-loader route-loader--pulsing');
  });

  it('should update text when input changes', () => {
    fixture.componentRef.setInput('text', 'Custom loading message');
    fixture.detectChanges();
    expect(component.text()).toBe('Custom loading message');
  });

});
