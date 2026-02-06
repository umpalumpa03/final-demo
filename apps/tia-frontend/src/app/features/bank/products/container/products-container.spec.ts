import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsContainer } from './products-container';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Subject } from 'rxjs';

describe('ProductsContainer', () => {
  let component: ProductsContainer;
  let fixture: ComponentFixture<ProductsContainer>;
  let router: Router;

  beforeEach(async () => {
    const routerEventsSubject = new Subject();

    const mockRouter = {
      url: '/bank/products/accounts',
      events: routerEventsSubject.asObservable(),
      navigate: vi.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsContainer, TranslateModule.forRoot()],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductsContainer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should detect accounts section when URL includes /accounts', () => {
    expect(component.isAccountsSection()).toBe(true);
  });

  it('should detect cards section when URL includes /cards', () => {
    (router as any).url = '/bank/products/cards/list';
    const newFixture = TestBed.createComponent(ProductsContainer);
    const newComponent = newFixture.componentInstance;
    expect(newComponent.isCardsSection()).toBe(true);
  });

  it('should show tabs when URL includes /accounts or /cards/list', () => {
    expect(component.shouldShowTabs).toBe(true);
  });

  it('should navigate to create account when onNewItemClick is called in accounts section', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onNewItemClick();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/bank/products/accounts/create',
    ]);
  });
});
