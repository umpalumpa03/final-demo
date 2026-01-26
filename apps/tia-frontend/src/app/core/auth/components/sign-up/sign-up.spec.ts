import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignUp } from './sign-up';
import { AuthService } from '../../services/auth-service';
import { of } from 'rxjs';

describe('SignUp', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;

  beforeEach(async () => {
    const mockAuth: Partial<AuthService> = {
      loginPostRequest: () => of({ status: 'ok' } as any),
    };

    await TestBed.configureTestingModule({
      imports: [SignUp],
      providers: [provideRouter([]), { provide: AuthService, useValue: mockAuth }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
