import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancesContainer } from './finances-container';

describe('FinancesContainer', () => {
  let component: FinancesContainer;
  let fixture: ComponentFixture<FinancesContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
