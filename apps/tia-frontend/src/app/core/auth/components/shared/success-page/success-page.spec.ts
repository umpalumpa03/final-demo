import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessPage } from './success-page';
import { provideRouter, Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('SuccessPage', () => {
  let component: SuccessPage;
  let fixture: ComponentFixture<SuccessPage>;
  let router: Router;
  let tokenService: TokenService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessPage],
      providers: [
        provideRouter([]),
        { 
          provide: TokenService, 
          useValue: { 
            clearAllToken: vi.fn(),
            getSignUpToken: 'mock-token',
            verifyToken: 'mock-verify'
          } 
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    tokenService = TestBed.inject(TokenService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should clear tokens and navigate when countdown reaches 0', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    
    fixture.detectChanges(); 

    component.countdown.set(0);

    fixture.detectChanges(); 

    expect(tokenService.clearAllToken).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/sign-in']);
  });
});