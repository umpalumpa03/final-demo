import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormDialog } from './form-dialog';

describe('FormDialog', () => {
  let component: FormDialog;
  let fixture: ComponentFixture<FormDialog>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialog, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDialog);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isOpen signal when toggle is called', () => {
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

    expect(component.projectNameInput()).toBeDefined();
    expect(component.projectDescriptionInput()).toBeDefined();
    expect(component.projectTitle()).toBeDefined();
    expect(component.projectSubtitle()).toBeDefined();
  });
});
