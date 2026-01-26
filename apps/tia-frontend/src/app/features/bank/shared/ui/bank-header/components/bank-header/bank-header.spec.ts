import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankHeader } from './bank-header';

describe('BankHeader', () => {
  let component: BankHeader;
  let fixture: ComponentFixture<BankHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
