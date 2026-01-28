import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoansContainer } from './loans-container';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

describe('LoansContainer', () => {
  let component: LoansContainer;
  let fixture: ComponentFixture<LoansContainer>;
  const initialState = {
    loans: {
      loans: [],
      loading: false,
      error: null,
    },
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansContainer],
      providers: [provideRouter([]), provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(LoansContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
