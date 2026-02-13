import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LeftSheetDemo } from './left-sheet-demo';
import { describe, it, expect, beforeEach } from 'vitest';

describe('LeftSheetDemo', () => {
  let component: LeftSheetDemo;
  let fixture: ComponentFixture<LeftSheetDemo>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSheetDemo, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(LeftSheetDemo);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update signal state when toggle() is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
  });

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translate.setTranslation('ka', {});
    translate.use('ka');
    fixture.detectChanges();

    expect(component.libraryNavItems()).toBeDefined();
    expect(component.sheetTitle()).toBeDefined();
    expect(component.sheetSubtitle()).toBeDefined();
  });
});
