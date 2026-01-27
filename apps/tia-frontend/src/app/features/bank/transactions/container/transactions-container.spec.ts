import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsContainer } from './transactions-container';

describe('TransactionsContainer', () => {
  let component: TransactionsContainer;
  let fixture: ComponentFixture<TransactionsContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
