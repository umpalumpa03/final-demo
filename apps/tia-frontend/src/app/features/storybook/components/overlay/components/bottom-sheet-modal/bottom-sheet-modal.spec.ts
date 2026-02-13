import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { BottomSheetModal } from './bottom-sheet-modal';

describe('BottomSheetModal', () => {
  let component: BottomSheetModal;
  let fixture: ComponentFixture<BottomSheetModal>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomSheetModal, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomSheetModal);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle state when toggle() is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translate.setTranslation('ka', {});
    translate.use('ka');
    fixture.detectChanges();

    expect(component.navConfig()).toBeDefined();
    expect(component.sheetTitle()).toBeDefined();
    expect(component.sheetSubtitle()).toBeDefined();
  });
});
