import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationHub } from './navigation-hub';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { NAVIGATION_HUB_ITEMS } from './config/navigation-hub.config';

describe('NavigationHub', () => {
  let component: NavigationHub;
  let fixture: ComponentFixture<NavigationHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationHub],
    }).compileComponents();
    fixture = TestBed.createComponent(NavigationHub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all navigation hub items', () => {
    const cards = fixture.debugElement.queryAll(
      By.css('app-navigation-hub-card'),
    );
    expect(cards.length).toBe(NAVIGATION_HUB_ITEMS.length);
  });
});
