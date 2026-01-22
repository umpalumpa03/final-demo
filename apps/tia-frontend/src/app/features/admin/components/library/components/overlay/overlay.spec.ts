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

  it('should render at least two showcase cards for dialogs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const showcaseCards = compiled.querySelectorAll('app-showcase-card');

    expect(showcaseCards.length).toBeGreaterThanOrEqual(2);
  });
});
