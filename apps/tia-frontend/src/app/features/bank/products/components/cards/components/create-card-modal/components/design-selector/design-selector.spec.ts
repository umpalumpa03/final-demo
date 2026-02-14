import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DesignSelector } from './design-selector';
import { TranslateModule } from '@ngx-translate/core';

describe('DesignSelector', () => {
  let component: DesignSelector;
  let fixture: ComponentFixture<DesignSelector>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DesignSelector,TranslateModule.forRoot()],
    
    });

    fixture = TestBed.createComponent(DesignSelector);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('designs', []);
    fixture.componentRef.setInput('selectedDesign', '');
    fixture.componentRef.setInput('isLoading', false);
  });

  it('should emit designSelected when design is selected', () => {
    const emitSpy = vi.fn();
    component.designSelected.subscribe(emitSpy);

    component['onSelectDesign']('design-1');

    expect(emitSpy).toHaveBeenCalledWith('design-1');
  });
});