import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiContext } from './ui-context';
import { describe, beforeEach, it, expect } from 'vitest';

describe('UiContext', () => {
  let component: UiContext;
  let fixture: ComponentFixture<UiContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiContext],
    }).compileComponents();

    fixture = TestBed.createComponent(UiContext);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('position', { x: 100, y: 200 });
    fixture.componentRef.setInput('items', [
      { label: 'Delete', action: 'delete', variant: 'danger' },
    ]);

    fixture.detectChanges();
  });

  it('should correctly compute menu styles from position signal', () => {
    expect(component.menuStyle()).toEqual({
      top: '200px',
      left: '100px',
    });
  });
});
