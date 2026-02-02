import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthHeader } from './auth-header';
import { TranslateModule } from '@ngx-translate/core';

describe('AuthHeader', () => {
  let component: AuthHeader;
  let fixture: ComponentFixture<AuthHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHeader, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'auth.sign-in.title');
    fixture.componentRef.setInput('subTitle', 'auth.sign-in.subtitle');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
