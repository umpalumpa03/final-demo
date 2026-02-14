import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductsContainer } from './products-container';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Subject } from 'rxjs';

describe('ProductsContainer', () => {
  let component: ProductsContainer;
  let fixture: ComponentFixture<ProductsContainer>;

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

    fixture = TestBed.createComponent(ProductsContainer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show tabs when URL includes /accounts or /cards/list', () => {
    expect(component.shouldShowTabs).toBe(true);
  });
});
