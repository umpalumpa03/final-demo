import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiContext } from './ui-context';
import { vi, describe, beforeEach, it, expect } from 'vitest';

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
      { label: 'Edit', action: 'edit', icon: 'edit-icon' },
      'divider',
    ]);

    fixture.detectChanges();
  });

  it('should correctly process items with icons and dividers', () => {
    const processed = component.processedItems();
    expect(processed[0]).toMatchObject({
      label: 'Edit',
      iconPath: 'url(images/svg/context/edit-icon.svg)',
    });
    expect(processed[1]).toBe('divider');
  });

  it('should emit menuClose on global interactions like scroll or resize', () => {
    const spy = vi.spyOn(component.menuClose, 'emit');

    component.onGlobalInteraction();

    expect(spy).toHaveBeenCalled();
  });
});
