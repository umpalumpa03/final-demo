import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { CustomizableWidgets } from '../../onboarding/shared/ui/customizable-widgets/customizable-widgets';
import { WIDGET_ITEMS } from '../../onboarding/shared/ui/customizable-widgets/config/customizable-widgets.config';

describe('CustomizableWidgets Integration', () => {
  let fixture: ComponentFixture<CustomizableWidgets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomizableWidgets, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizableWidgets);
    fixture.detectChanges();
  });

  it('should render correct number of cards with matching data', () => {
    const cards = fixture.debugElement.queryAll(By.css('app-widget-card'));
    expect(cards.length).toBe(WIDGET_ITEMS.length);

    const titles = fixture.debugElement.queryAll(By.css('.widget-card__title'));
    const descs = fixture.debugElement.queryAll(By.css('.widget-card__desc'));

    titles.forEach((el, i) => {
      expect(el.nativeElement.textContent).toContain(WIDGET_ITEMS[i].title);
    });
    descs.forEach((el, i) => {
      expect(el.nativeElement.textContent).toContain(
        WIDGET_ITEMS[i].description,
      );
    });
  });

  it('should apply correct color class to each card', () => {
    const cards = fixture.debugElement.queryAll(By.css('.widget-card'));

    cards.forEach((card, i) => {
      const expectedClass = `widget-card--${WIDGET_ITEMS[i].color}`;
      expect(card.nativeElement.classList.contains(expectedClass)).toBe(true);
    });
  });
});
