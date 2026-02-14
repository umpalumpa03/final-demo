import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { NavigationHub } from '../../onboarding/shared/ui/navigation-hub/navigation-hub';
import { NAVIGATION_HUB_ITEMS } from '../../onboarding/shared/ui/navigation-hub/config/navigation-hub.config';

describe('NavigationHub Integration', () => {
  let fixture: ComponentFixture<NavigationHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationHub, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationHub);
    fixture.detectChanges();
  });

  it('should render correct number of cards with matching data', () => {
    const cards = fixture.debugElement.queryAll(
      By.css('app-navigation-hub-card'),
    );
    expect(cards.length).toBe(NAVIGATION_HUB_ITEMS.length);

    const titles = fixture.debugElement.queryAll(By.css('.nav-card__title'));
    const descs = fixture.debugElement.queryAll(By.css('.nav-card__desc'));

    titles.forEach((el, i) => {
      expect(el.nativeElement.textContent).toContain(
        NAVIGATION_HUB_ITEMS[i].title,
      );
    });
    descs.forEach((el, i) => {
      expect(el.nativeElement.textContent).toContain(
        NAVIGATION_HUB_ITEMS[i].description,
      );
    });
  });

  it('should render icon images with correct src', () => {
    const imgs = fixture.debugElement.queryAll(By.css('.nav-card__icon img'));

    expect(imgs.length).toBe(NAVIGATION_HUB_ITEMS.length);
    imgs.forEach((el, i) => {
      expect(el.nativeElement.src).toContain(NAVIGATION_HUB_ITEMS[i].icon);
    });
  });
});
