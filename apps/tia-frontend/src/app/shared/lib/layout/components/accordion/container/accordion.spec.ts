import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { Accordion } from './accordion';
import { AccordionItem } from '../accordion-item/accordion-item';

@Component({
  standalone: true,
  imports: [Accordion, AccordionItem],
  template: `
    <app-accordion [multi]="false">
      <app-accordion-item title="Item 1" />
      <app-accordion-item title="Item 2" />
    </app-accordion>
  `,
})
class TestHostComponent {}

describe('AccordionComponent Coordination', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should only allow one item open when multi is false', () => {
    const items = fixture.nativeElement.querySelectorAll(
      '.accordion-item__trigger',
    );

    items[0].click();
    fixture.detectChanges();

    items[1].click();
    fixture.detectChanges();

    const openItems = fixture.nativeElement.querySelectorAll('.is-open');
    expect(openItems.length).toBe(1);
  });
});
