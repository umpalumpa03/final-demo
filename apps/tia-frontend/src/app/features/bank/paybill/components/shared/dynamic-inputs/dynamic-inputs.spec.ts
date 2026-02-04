import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicInputs } from './dynamic-inputs';
import { PaybillDynamicForm } from '../../../services/paybill-dynamic-form/paybill-dynamic-form';
import { FormGroup, FormControl } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('DynamicInputs', () => {
  let component: DynamicInputs;
  let fixture: ComponentFixture<DynamicInputs>;
  let mockDynamicFormService: any;

  beforeEach(async () => {
    mockDynamicFormService = {
      mapFieldToConfig: vi.fn((field) => ({
        label: 'Mock Label',
        placeholder: 'Mock Placeholder',
      })),
    };

    await TestBed.configureTestingModule({
      imports: [DynamicInputs],
      providers: [
        { provide: PaybillDynamicForm, useValue: mockDynamicFormService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicInputs);
    component = fixture.componentInstance;

    fixture.componentRef.setInput(
      'form',
      new FormGroup({
        testField: new FormControl(''),
      }),
    );
    fixture.componentRef.setInput('fields', [
      { id: 'testField', type: 'text', label: 'Test' } as any,
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
