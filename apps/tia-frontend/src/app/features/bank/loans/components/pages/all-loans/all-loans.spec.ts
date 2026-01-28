import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllLoans } from './all-loans';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { LoansActions } from '../../../store/loans.actions';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AllLoans', () => {
  let component: AllLoans;
  let fixture: ComponentFixture<AllLoans>;
  let store: MockStore;
  const initialState = {
    loans_local: {
      loans: [],
      loading: false,
      error: null,
      filterStatus: null,
      months: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllLoans],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');
    vi.spyOn(console, 'log');

    fixture = TestBed.createComponent(AllLoans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadLoans action on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(LoansActions.loadLoans());
  });

  it('should dispatch renameLoan action when onRenameLoan is called', () => {
    const event = { id: '123', name: 'New Name' };
    component.onRenameLoan(event);

    expect(store.dispatch).toHaveBeenCalledWith(
      LoansActions.renameLoan({ id: event.id, name: event.name }),
    );
  });

  it('should log ID when card is clicked', () => {
    component.onCardClick('123');
    expect(console.log).toHaveBeenCalledWith('Clicked', '123');
  });
});
