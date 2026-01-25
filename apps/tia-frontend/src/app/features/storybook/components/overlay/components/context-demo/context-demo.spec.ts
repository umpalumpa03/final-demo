import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextDemo } from './context-demo';

describe('ContextDemo', () => {
  let component: ContextDemo;
  let fixture: ComponentFixture<ContextDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextDemo],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextDemo);
    component = fixture.componentInstance;
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
});
