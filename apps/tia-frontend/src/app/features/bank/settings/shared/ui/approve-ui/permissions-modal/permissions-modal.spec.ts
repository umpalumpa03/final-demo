import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionsModal } from './permissions-modal';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';

describe('PermissionsModal', () => {
  let component: PermissionsModal;
  let fixture: ComponentFixture<PermissionsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PermissionsModal,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('form', new FormGroup({}));
    fixture.componentRef.setInput('items', []);
    fixture.componentRef.setInput('name', 'Test');
  });

  it('should correctly count active permissions when form changes', () => {
    const form = new FormGroup({
      '1': new FormControl(false),
      '2': new FormControl(false),
    });

    fixture.componentRef.setInput('form', form);
    fixture.componentRef.setInput('items', [
      { value: 1, label: 'Test 1' },
      { value: 2, label: 'Test 2' },
    ]);

    fixture.detectChanges();
    expect(component.activeCount()).toBe(0);

    form.patchValue({ '1': true });
    fixture.detectChanges();
    expect(component.activeCount()).toBe(1);
  });

  it('should correctly map inputs to cardOrAccHolder display item', () => {
    fixture.componentRef.setInput('name', 'Giorgi');
    fixture.componentRef.setInput('accOrCardName', 'Main Account');

    fixture.detectChanges();

    const result = component.cardOrAccHolder()[0];
    expect(result.initials).toBe('G');
    expect(result.name).toBe('Main Account');
    expect(result.role).toBe('Giorgi');
  });

  it('should emit save event when save is emitted', () => {
    const spy = vi.spyOn(component.save, 'emit');
    component.save.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel is emitted', () => {
    const spy = vi.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(spy).toHaveBeenCalled();
  });
});
