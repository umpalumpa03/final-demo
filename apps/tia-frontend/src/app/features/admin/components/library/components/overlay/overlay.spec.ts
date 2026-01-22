import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Overlay } from './overlay';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Overlay', () => {
  let component: Overlay;
  let fixture: ComponentFixture<Overlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Overlay],
    }).compileComponents();

    fixture = TestBed.createComponent(Overlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the overlay component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct page title and subtitle', () => {
    expect(component.pageTitle).toBe('Overlay Components');
    expect(component.pageSubtitle).toBe(
      'Modal dialogs, sheets, popovers, and dropdown menu',
    );
  });

  it('should render the library title component in the header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const libraryTitle = compiled.querySelector('app-library-title');
    expect(libraryTitle).not.toBeNull();
  });

  it('should render at least two showcase cards for dialogs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const showcaseCards = compiled.querySelectorAll('app-showcase-card');

    expect(showcaseCards.length).toBeGreaterThanOrEqual(2);
  });
});
