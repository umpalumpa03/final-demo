import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveAccountsContainer } from './approve-accounts-container';
import { AccountPermissionsStore } from '../store/aprove-accounts.store';
import { signal, WritableSignal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ApproveAccountsContainer', () => {
  let component: ApproveAccountsContainer;
  let fixture: ComponentFixture<ApproveAccountsContainer>;
  let mockPermissionsSignal: WritableSignal<any[]>;

  beforeEach(async () => {
    mockPermissionsSignal = signal([]);

    await TestBed.configureTestingModule({
      imports: [ApproveAccountsContainer],
    })
      .overrideComponent(ApproveAccountsContainer, {
        set: {
          providers: [
            {
              provide: AccountPermissionsStore,
              useValue: {
                loadPermissions: vi.fn(),
                permissions: mockPermissionsSignal,
              },
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ApproveAccountsContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init correctly and call loadPermissions', () => {
    expect(component).toBeTruthy();
    const store = fixture.debugElement.injector.get(AccountPermissionsStore);
    expect(store.loadPermissions).toHaveBeenCalled();
  });

  it('should generate form from store data and save selected IDs correctly', () => {
    mockPermissionsSignal.set([
      { value: 10, name: 'Perm A' },
      { value: 20, name: 'Perm B' },
    ]);
    fixture.detectChanges();

    const form = component.permissionsForm;
    expect(form.contains('10')).toBe(true);
    expect(form.contains('20')).toBe(true);

    form.patchValue({
      '10': true,
      '20': false,
    });

    component.save();

    expect(component.selectIds()).toEqual([10]);
  });
});
