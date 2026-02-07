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

  it('should emit editPersonalNumber when onEditPersonalNumber is called', () => {
    const emitSpy = vi.spyOn(component.editPersonalNumber, 'emit');
    component.onEditPersonalNumber();
    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('should emit personalNumberChange when onPersonalNumberChange is called', () => {
    const emitSpy = vi.spyOn(component.personalNumberChange, 'emit');
    const testValue = '12345678901';
    component.onPersonalNumberChange(testValue);
    expect(emitSpy).toHaveBeenCalledWith(testValue);
  });

  it('should emit cancelEditPersonalNumber when onCancelEdit is called', () => {
    const emitSpy = vi.spyOn(component.cancelEditPersonalNumber, 'emit');
    component.onCancelEdit();
    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('should emit updatePersonalNumber with editedPId when onSavePersonalNumber is called', () => {
    const emitSpy = vi.spyOn(component.updatePersonalNumber, 'emit');
    fixture.componentRef.setInput('editedPId', '12345678901');
    fixture.detectChanges();
    component.onSavePersonalNumber();
    expect(emitSpy).toHaveBeenCalledWith('12345678901');
  });
});
