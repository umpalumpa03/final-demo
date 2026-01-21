import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Overlay } from './overlay';
import { vi } from 'vitest';

describe('Overlay', () => {
  let component: Overlay;
  let fixture: ComponentFixture<Overlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Overlay],
    }).compileComponents();

    fixture = TestBed.createComponent(Overlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle a signal state when toggle() is called', () => {
    const signal = component.isDeleteAlertOpen;

    expect(signal()).toBe(false);
    component.toggle(signal);
    expect(signal()).toBe(true);
    component.toggle(signal);
    expect(signal()).toBe(false);
  });

  it('should prevent default behavior on onContextMenu()', () => {
    const mockEvent = { preventDefault: vi.fn() } as unknown as MouseEvent;

    component.onContextMenu(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should trigger toggle for Delete Alert when clicking the danger button', () => {
    const deleteBtn = fixture.debugElement.query(By.css('.btn-danger'));

    deleteBtn.triggerEventHandler('click', null);

    expect(component.isDeleteAlertOpen()).toBe(true);
  });

  it('should trigger toggle for Right Sheet when clicking the Open Right Sheet button', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const rightSheetBtn = buttons.find(
      (btn) => btn.nativeElement.textContent.trim() === 'Open Right Sheet',
    );

    if (rightSheetBtn) {
      rightSheetBtn.triggerEventHandler('click', null);
    }

    expect(component.isRightSheetOpen()).toBe(true);
  });
});
