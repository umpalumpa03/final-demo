import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCommandPalette } from './ui-command-palette';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('UiCommandPalette', () => {
  let component: UiCommandPalette;
  let fixture: ComponentFixture<UiCommandPalette>;

  const mockActions = [
    { id: '1', label: 'Save', icon: 'save', isSuggestion: true },
    { id: '2', label: 'Delete', icon: 'trash', isSuggestion: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCommandPalette],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCommandPalette);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('actions', mockActions);
    fixture.detectChanges();
  });

  it('should handle keyboard navigation and emit selected action with processed data', () => {
    const selectionSpy = vi.spyOn(component.actionSelected, 'emit');

    fixture.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
    );
    expect(component.activeIndex()).toBe(1);

    fixture.nativeElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );

    expect(selectionSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '2',
        label: 'Delete',
        fullIconPath: expect.stringContaining('trash.svg'),
      }),
    );
  });

  it('should update search results and handle escape key', () => {
    const closeSpy = vi.spyOn(component.menuClose, 'emit');

    component.handleInput({ target: { value: 'Save' } } as any);
    expect(component.suggestions().length).toBe(1);
    expect(component.otherActions().length).toBe(0);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(closeSpy).toHaveBeenCalled();
  });
});
