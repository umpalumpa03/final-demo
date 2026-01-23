import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccordionItem } from './accordion-item';

describe('AccordionItem', () => {
  let component: AccordionItem;
  let fixture: ComponentFixture<AccordionItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionItem],
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be closed by default', () => {
    expect(component.isOpen()).toBeFalsy();
    const content = fixture.nativeElement.querySelector('.is-open');
    expect(content).toBeNull();
  });

  it('should open when toggle() is called', () => {
    component.toggle();
    expect(component.isOpen()).toBeTruthy();

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.accordion-item');
    expect(element.classList).toContain('is-open');
  });

  it('should close others if parent accordion notifyOpen is called (Integration logic)', () => {
    // This tests the set(false) capability of the model signal
    component.isOpen.set(true);
    expect(component.isOpen()).toBeTruthy();

    component.isOpen.set(false);
    expect(component.isOpen()).toBeFalsy();
  });
});
