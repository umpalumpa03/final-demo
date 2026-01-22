import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TopSheetModal } from './top-sheet-modal';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('TopSheetModal', () => {
  let component: TopSheetModal;
  let fixture: ComponentFixture<TopSheetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSheetModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TopSheetModal);
    component = fixture.componentInstance;
  });

  it('should set titles and pass them to the library-title component', async () => {
    component.modalTitle = 'Privacy Update';
    component.modalSubtitle = 'Action Required';

    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const libraryTitle = fixture.debugElement.query(
      By.css('app-library-title'),
    );

    if (!libraryTitle) {
      component.toggle();
      fixture.detectChanges();
    }

    const finalLibraryTitle = fixture.debugElement.query(
      By.css('app-library-title'),
    );
    expect(finalLibraryTitle).not.toBeNull();

    const titleValue =
      typeof finalLibraryTitle.componentInstance.title === 'function'
        ? finalLibraryTitle.componentInstance.title()
        : finalLibraryTitle.componentInstance.title;

    expect(titleValue).toBe('Privacy Update');
  });

  it('should pass the correct direction to ui-sheet-modal', () => {
    fixture.detectChanges();
    const sheetModal = fixture.debugElement.query(By.css('app-ui-sheet-modal'));

    expect(sheetModal).not.toBeNull();

    expect(sheetModal.componentInstance.direction()).toBe('top');
  });

  it('should call toggle() when the trigger button is clicked', () => {
    fixture.detectChanges();
    const toggleSpy = vi.spyOn(component, 'toggle');
    const button = fixture.debugElement.query(By.css('.btn__bottom-trigger'));

    button.nativeElement.click();
    expect(toggleSpy).toHaveBeenCalled();
  });
});
