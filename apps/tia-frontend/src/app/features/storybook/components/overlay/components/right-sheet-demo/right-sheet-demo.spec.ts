import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RightSheetDemo } from './right-sheet-demo';

describe('RightSheetDemo', () => {
  let component: RightSheetDemo;
  let fixture: ComponentFixture<RightSheetDemo>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSheetDemo, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RightSheetDemo);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isOpen signal when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translate.setTranslation('ka', {});
    translate.use('ka');
    fixture.detectChanges();

    expect(component.sheetTitle()).toBeDefined();
    expect(component.sheetSubtitle()).toBeDefined();
    expect(component.usernameInput()).toBeDefined();
    expect(component.bioInput()).toBeDefined();
  });
});
