import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeclinedLoans } from './declined-loans';
import { provideMockStore } from '@ngrx/store/testing';

describe('DeclinedLoans', () => {
  let component: DeclinedLoans;
  let fixture: ComponentFixture<DeclinedLoans>;

  const initialState = {
    loans: {
      loans: [],
      loading: false,
      error: null,
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclinedLoans],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(DeclinedLoans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
