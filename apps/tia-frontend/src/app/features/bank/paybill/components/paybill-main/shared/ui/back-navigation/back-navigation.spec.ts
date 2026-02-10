import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackNavigation } from './back-navigation';
import { PaybillMainFacade } from '../../../services/paybill-main-facade';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('BackNavigation', () => {
  let component: BackNavigation;
  let fixture: ComponentFixture<BackNavigation>;
  let facadeMock: any;
  let routerMock: any;

  beforeEach(async () => {
    facadeMock = {
      activeCategory: signal(null),
      selectedParentId: signal(null),
    };

    routerMock = {
      url: '/paybill/utilities/selection',
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [BackNavigation, TranslateModule.forRoot()],
      providers: [
        { provide: PaybillMainFacade, useValue: facadeMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('navInfo computed', () => {
    it('should return null if no active category', () => {
      facadeMock.activeCategory.set(null);

      expect((component as any).navInfo()).toBeNull();
    });

    it('should return "Categories" label if category exists but no selected ID', () => {
      facadeMock.activeCategory.set({ name: 'Utilities' });
      facadeMock.selectedParentId.set(null);

      expect((component as any).navInfo()).toEqual({ label: 'Categories' });
    });

    it('should return category name if selected ID exists', () => {
      facadeMock.activeCategory.set({
        name: 'Utilities',
        providers: [{ id: '123', name: 'Gas' }],
      });
      facadeMock.selectedParentId.set('123');

      expect((component as any).navInfo()).toEqual({ label: 'Utilities' });
    });
  });

  describe('onBack', () => {
    it('should navigate to parent route', () => {
      routerMock.url = '/paybill/utilities';

      component.onBack();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/paybill']);
    });

    it('should handle deeper nested routes', () => {
      routerMock.url = '/a/b/c';

      component.onBack();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/a/b']);
    });
  });
});
