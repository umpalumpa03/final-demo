import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModal } from './confirm-modal';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ConfirmModal', () => {
  let component: ConfirmModal;
  let fixture: ComponentFixture<ConfirmModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();
  });

  it('should create and handle inputs', () => {
    expect(component).toBeTruthy();
    expect(component.isOpen()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should emit outputs on actions', () => {
    const closeSpy = vi.spyOn(component.close, 'emit');
    const deleteSpy = vi.spyOn(component.deleteUser, 'emit');

    component.close.emit();
    expect(closeSpy).toHaveBeenCalled();

    component.deleteUser.emit();
    expect(deleteSpy).toHaveBeenCalled();
  });
});
