import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accordion } from './accordion';

describe('Accordion', () => {
  let component: Accordion;
  let fixture: ComponentFixture<Accordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accordion],
    }).compileComponents();

    fixture = TestBed.createComponent(Accordion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have multi default to false', () => {
    expect(component.multi()).toBe(false);
  });

  it('should accept multi input', () => {
    fixture.componentRef.setInput('multi', true);
    fixture.detectChanges();
    expect(component.multi()).toBe(true);
  });
});
