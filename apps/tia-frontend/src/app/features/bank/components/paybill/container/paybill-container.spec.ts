import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaybillContainer } from './paybill-container';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('PaybillContainer', () => {
  let component: PaybillContainer;
  let fixture: ComponentFixture<PaybillContainer>;

  const initialState = {
    paybill: {
      categories: [],
      activeCategoryId: null,
      activeProviderId: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaybillContainer],
      providers: [provideMockStore({ initialState }), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PaybillContainer);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
