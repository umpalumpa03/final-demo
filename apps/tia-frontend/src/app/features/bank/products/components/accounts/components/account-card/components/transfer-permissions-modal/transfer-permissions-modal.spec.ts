import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferPermissionsModalComponent } from './transfer-permissions-modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  TRANSFER_PERMISSIONS,
  VALID_PERMISSION_VALUES,
} from '../../../../config/transfer-permissions.config';

describe('TransferPermissionsModalComponent', () => {
  let component: TransferPermissionsModalComponent;
  let fixture: ComponentFixture<TransferPermissionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferPermissionsModalComponent, TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TransferPermissionsModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isOpen', false);
    fixture.componentRef.setInput('accountPermission', 0);
  });

  it('should create with required inputs and outputs', () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 1);
    expect(component.permissionSelected).toBeDefined();
    expect(component.closed).toBeDefined();
  });

  it('should return all transfer permissions', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 1);
    expect(component.permissions()).toEqual(TRANSFER_PERMISSIONS);
    expect(component.permissions().length).toBe(6);
  });

  it('should return empty array for invalid permission', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 999);
    expect(component.availablePermissions()).toEqual([]);
  });

  it('should filter available permissions by bitwise AND', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 1);
    const available = component.availablePermissions();
    expect(available.length).toBeGreaterThan(0);
    expect(available.every((p) => (1 & p.value) === p.value)).toBe(true);
    expect(
      available.every((p) =>
        VALID_PERMISSION_VALUES.includes(
          p.value as (typeof VALID_PERMISSION_VALUES)[number],
        ),
      ),
    ).toBe(true);
  });

  it('should update availablePermissions when accountPermission changes', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 1);
    const first = component.availablePermissions();
    fixture.componentRef.setInput('accountPermission', 3);
    expect(first).not.toEqual(component.availablePermissions());
  });

  it('should emit permissionSelected when onPermissionSelect is called', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 1);
    const spy = vi.fn();
    component.permissionSelected.subscribe(spy);
    component.onPermissionSelect(2);
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should emit closed when onClose is called', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 1);
    const spy = vi.fn();
    component.closed.subscribe(spy);
    component.onClose();
    expect(spy).toHaveBeenCalled();
  });
});
