import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityComponent } from './security.component';
import { TranslateModule } from '@ngx-translate/core';
import { vi } from 'vitest';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.changePasswordForm).toBeDefined();
    expect(component.changePasswordForm.invalid).toBe(true);
  });

  it('should emit changePassword event when form is valid', () => {
    const emitSpy = vi.spyOn(component.changePassword, 'emit');

    component.changePasswordForm.setValue({
      currentPassword: 'currentPass123',
      newPassword: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({
      currentPassword: 'currentPass123',
      newPassword: 'newPassword123',
    });
  });

  it('should not emit changePassword event when form is invalid', () => {
    const emitSpy = vi.spyOn(component.changePassword, 'emit');

    component.onSubmit();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
