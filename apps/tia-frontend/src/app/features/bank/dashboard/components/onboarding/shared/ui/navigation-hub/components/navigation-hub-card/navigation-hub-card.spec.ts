import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationHubCard } from './navigation-hub-card';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';
import { NavigationHubItem } from '../../models/navigation-hub.model';
import { TranslateModule } from '@ngx-translate/core';

const mockItem: NavigationHubItem = {
  icon: 'images/svg/onboarding/dashboard.svg',
  title: 'Dashboard',
  description: 'Your financial overview and widgets',
};

describe('NavigationHubCard', () => {
  let component: NavigationHubCard;
  let fixture: ComponentFixture<NavigationHubCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationHubCard, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(NavigationHubCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display item title and description', () => {
    const title = fixture.debugElement.query(By.css('.nav-card__title'));
    const desc = fixture.debugElement.query(By.css('.nav-card__desc'));

    expect(title.nativeElement.textContent).toContain(mockItem.title);
    expect(desc.nativeElement.textContent).toContain(mockItem.description);
  });

  it('should render the icon image', () => {
    const img = fixture.debugElement.query(By.css('.nav-card__icon img'));
    expect(img.nativeElement.src).toContain('dashboard.svg');
    expect(img.nativeElement.alt).toBe('Dashboard');
  });
});
