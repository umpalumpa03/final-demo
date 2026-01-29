import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifySignin } from './verify-signin';

describe('VerifySignin', () => {
  let component: VerifySignin;
  let fixture: ComponentFixture<VerifySignin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifySignin],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifySignin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
