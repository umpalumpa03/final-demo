import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalFromAccount } from './internal-from-account';

describe('InternalFromAccount', () => {
  let component: InternalFromAccount;
  let fixture: ComponentFixture<InternalFromAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalFromAccount],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalFromAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
