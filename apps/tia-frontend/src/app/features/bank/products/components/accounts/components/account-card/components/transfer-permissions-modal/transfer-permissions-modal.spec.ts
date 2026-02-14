import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferPermissionsModalComponent } from './transfer-permissions-modal';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TRANSFER_PERMISSIONS } from '../../../../config/transfer-permissions.config';

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

  it('should return empty array for zero permission', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 0);
    expect(component.availablePermissions()).toEqual([]);
  });

  it('should filter available permissions by bitwise AND', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 1);
    const available = component.availablePermissions();
    expect(available.length).toBe(1);
    expect(available[0].value).toBe(1);
  });

  it('should decode composite permission 3 into permissions 1 and 2 for GEL', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 3);
    fixture.componentRef.setInput('accountCurrency', 'GEL');
    const available = component.availablePermissions();
    expect(available.map((p) => p.value)).toEqual([1, 2]);
  });

  it('should decode composite permission 3 into permissions 1 and 4 for non-GEL', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 3);
    fixture.componentRef.setInput('accountCurrency', 'USD');
    const available = component.availablePermissions();
    expect(available.map((p) => p.value)).toEqual([1]);
  });

  it('should exclude permission 4 for GEL currency with composite permission 15', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 15);
    fixture.componentRef.setInput('accountCurrency', 'GEL');
    const available = component.availablePermissions();
    expect(available.map((p) => p.value)).toEqual([1, 2, 8]);
  });

  it('should exclude permission 2 for non-GEL currency with composite permission 15', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 15);
    fixture.componentRef.setInput('accountCurrency', 'USD');
    const available = component.availablePermissions();
    expect(available.map((p) => p.value)).toEqual([1, 4, 8]);
  });

  it('should decode all permissions (63) for GEL currency', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 63);
    fixture.componentRef.setInput('accountCurrency', 'GEL');
    const available = component.availablePermissions();
    expect(available.map((p) => p.value)).toEqual([1, 2, 8, 16, 32]);
  });

  it('should decode all permissions (63) for non-GEL currency', () => {
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('accountPermission', 63);
    fixture.componentRef.setInput('accountCurrency', 'EUR');
    const available = component.availablePermissions();
    expect(available.map((p) => p.value)).toEqual([1, 4, 8, 16, 32]);
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
