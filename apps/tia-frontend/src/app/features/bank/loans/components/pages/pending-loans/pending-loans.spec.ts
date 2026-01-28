import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingLoans } from './pending-loans';
import { provideMockStore } from '@ngrx/store/testing';

describe('PendingLoans', () => {
  let component: PendingLoans;
  let fixture: ComponentFixture<PendingLoans>;
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
      imports: [PendingLoans],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingLoans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
