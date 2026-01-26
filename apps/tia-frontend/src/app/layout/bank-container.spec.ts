import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BankContainer } from './bank-container';

describe('BankContainer', () => {
  let component: BankContainer;
  let fixture: ComponentFixture<BankContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankContainer],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BankContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
