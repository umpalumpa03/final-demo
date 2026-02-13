import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContextDemo } from './context-demo';

describe('ContextDemo', () => {
  let component: ContextDemo;
  let fixture: ComponentFixture<ContextDemo>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextDemo, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextDemo);
    component = fixture.componentInstance;
    translate = TestBed.inject(TranslateService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update menu visibility and position on right click', () => {
    const mockEvent = {
      preventDefault: vi.fn(),
      clientX: 400,
      clientY: 300,
    } as unknown as MouseEvent;

    component.onRightClick(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.isMenuVisible()).toBe(true);
    expect(component.menuPosition()).toEqual({ x: 400, y: 300 });
  });

  it('should hide the menu when handleAction is invoked', () => {
    component.isMenuVisible.set(true);
    component.handleAction();
    expect(component.isMenuVisible()).toBe(false);
  });

  it('should update signals when language changes', () => {
    component.ngOnInit();
    translate.setTranslation('ka', {});
    translate.use('ka');

    expect(component.menuItems()).toBeDefined();
    expect(component.contextTitle()).toBeDefined();
    expect(component.contextSubtitle()).toBeDefined();
    expect(component.contextHint()).toBeDefined();
  });
});
