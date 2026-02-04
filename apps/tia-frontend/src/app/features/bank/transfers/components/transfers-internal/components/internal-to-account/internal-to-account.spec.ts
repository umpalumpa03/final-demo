import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalToAccount } from './internal-to-account';

describe('InternalToAccount', () => {
  let component: InternalToAccount;
  let fixture: ComponentFixture<InternalToAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalToAccount],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalToAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
