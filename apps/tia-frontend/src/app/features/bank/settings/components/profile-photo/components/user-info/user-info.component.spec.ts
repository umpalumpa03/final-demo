import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInfoComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit when onEdit is called', () => {
    const emitSpy = vi.spyOn(component.edit, 'emit');
    component.onEdit();
    expect(emitSpy).toHaveBeenCalledOnce();
  }); 

  it('should emit personalNumberChange when onPersonalNumberChange is called', () => {
    const emitSpy = vi.spyOn(component.personalNumberChange, 'emit');
    const testValue = '12345678901';
    component.onPersonalNumberChange(testValue);
    expect(emitSpy).toHaveBeenCalledWith(testValue);
  });

  it('should emit cancelEdit when onCancelEdit is called', () => {
    const emitSpy = vi.spyOn(component.cancelEdit, 'emit');
    component.onCancelEdit();
    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('should emit save when onSave is called', () => {
    const emitSpy = vi.spyOn(component.save, 'emit');
    component.onSave();
    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('should emit phoneNumberChange when onPhoneNumberChange is called', () => {
    const emitSpy = vi.spyOn(component.phoneNumberChange, 'emit');
    const testValue = '555123456';
    component.onPhoneNumberChange(testValue);
    expect(emitSpy).toHaveBeenCalledWith(testValue);
  });
});
