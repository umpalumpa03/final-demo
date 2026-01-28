import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dropdowns } from './dropdowns';

describe('Dropdowns', () => {
  let component: Dropdowns;
  let fixture: ComponentFixture<Dropdowns>;
  const mockOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dropdowns],
    }).compileComponents();

    fixture = TestBed.createComponent(Dropdowns);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle visibility when clicked', () => {
    expect(component.isOpen()).toBe(false);

    const mockEvent = { stopPropagation: () => {} } as MouseEvent;

    component['toggleDropdown'](mockEvent);
    expect(component.isOpen()).toBe(true);

    component['toggleDropdown'](mockEvent);
    expect(component.isOpen()).toBe(false);
  });

  it('should update value and close when option selected', () => {
    component.isOpen.set(true);
    component['selectOption'](mockOptions[1]);

    expect(component['value']()).toBe(2);
    expect(component.isOpen()).toBe(false);
  });
});
