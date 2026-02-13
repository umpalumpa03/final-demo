import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DrawerModal } from './drawer-modal';

describe('DrawerModal', () => {
  let component: DrawerModal;
  let fixture: ComponentFixture<DrawerModal>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerModal, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerModal);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the isOpen signal state when toggle() is called', () => {
    expect(component.isOpen()).toBe(false);
    component.toggle();
    expect(component.isOpen()).toBe(true);
    component.toggle();
    expect(component.isOpen()).toBe(false);
  });

  it('should close the drawer via toggle() when onSubmit() is triggered', () => {
    component.isOpen.set(true);
    component.onSubmit();
    expect(component.isOpen()).toBe(false);
  });

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translate.setTranslation('ka', {});
    translate.use('ka');

    expect(component.nameConfig()).toBeDefined();
    expect(component.emailConfig()).toBeDefined();
    expect(component.drawerTitle()).toBeDefined();
    expect(component.drawerSubtitle()).toBeDefined();
  });
});
