import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionsModal } from './permissions-modal';
import { FormControl, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';

describe('PermissionsModal', () => {
  let component: PermissionsModal;
  let fixture: ComponentFixture<PermissionsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsModal],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PermissionsModal);
    component = fixture.componentInstance;
  });

  it('should correctly count active permissions when form changes', () => {
    const form = new FormGroup({
      '1': new FormControl(false),
      '2': new FormControl(false)
    });

    fixture.componentRef.setInput('form', form);
    
    fixture.componentRef.setInput('items', [
      { value: 1, label: 'Test 1' }, 
      { value: 2, label: 'Test 2' }
    ]); 
    
    fixture.detectChanges();

    expect(component.activeCount()).toBe(0);

    form.patchValue({ '1': true });
    fixture.detectChanges();

    expect(component.activeCount()).toBe(1);
  });
});