import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AuthContainer } from './auth-container';

describe('AuthContainer', () => {
  let component: AuthContainer;
  let fixture: ComponentFixture<AuthContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthContainer],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { data: {} },
            data: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
