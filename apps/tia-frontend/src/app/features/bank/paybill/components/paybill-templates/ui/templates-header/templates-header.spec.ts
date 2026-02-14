import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplatesHeader } from './templates-header';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderCtaAction } from '../../models/paybill-templates.model';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TemplatesHeader', () => {
  let component: TemplatesHeader;
  let fixture: ComponentFixture<TemplatesHeader>;

  const initialState = {
    paybill: {
      templates: [],
      selectedItems: [],
    },
  };

  const mockButtons = [
    {
      label: 'Create',
      action: 'Create' as unknown as HeaderCtaAction,
      variant: 'primary',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesHeader, TranslateModule.forRoot()],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplatesHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('headerButtons', mockButtons);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should receive header buttons input', () => {
    expect(component.headerButtons()).toEqual(mockButtons);
  });

  it('should have default value for showSelectedItems', () => {
    expect(component.showSelectedItems()).toBe(false);
  });

  it('should emit buttonClick when a header action is triggered', () => {
    const spy = vi.spyOn(component.buttonClick, 'emit');
    const action = mockButtons[0].action;
    component.buttonClick.emit(action);
    expect(spy).toHaveBeenCalledWith(action);
  });

  it('should emit paySelected when triggered', () => {
    const spy = vi.spyOn(component.paySelected, 'emit');
    component.paySelected.emit();
    expect(spy).toHaveBeenCalled();
  });

  it('should update showSelectedItems when input changes', () => {
    fixture.componentRef.setInput('showSelectedItems', true);
    fixture.detectChanges();
    expect(component.showSelectedItems()).toBe(true);
  });
});
