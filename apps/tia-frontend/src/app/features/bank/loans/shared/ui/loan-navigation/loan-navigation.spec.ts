import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanNavigation } from './loan-navigation';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

describe('LoanNavigation', () => {
  let component: LoanNavigation;
  let fixture: ComponentFixture<LoanNavigation>;
  const initialState = {
    loans_local: {
      loans: [],
      loading: false,
      months: [],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanNavigation],
      providers: [provideRouter([]), provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanNavigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
