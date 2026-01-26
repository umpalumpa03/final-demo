import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankHeaderContainer } from './bank-header-container';

describe('BankHeaderContainer', () => {
  let component: BankHeaderContainer;
  let fixture: ComponentFixture<BankHeaderContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHeaderContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHeaderContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
