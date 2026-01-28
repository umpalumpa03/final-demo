import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApprovedLoans } from './approved-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('ApprovedLoans', () => {
  let component: ApprovedLoans;
  let fixture: ComponentFixture<ApprovedLoans>;
  let store: MockStore;

  const initialState = {
    loans_local: {
      loans: [],
      loading: false,
      error: null,
      months: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedLoans],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(ApprovedLoans);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
