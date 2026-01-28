import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExternalAccounts } from './external-accounts';

describe('ExternalAccounts', () => {
  let component: ExternalAccounts;
  let fixture: ComponentFixture<ExternalAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalAccounts],
    }).compileComponents();

    fixture = TestBed.createComponent(ExternalAccounts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
