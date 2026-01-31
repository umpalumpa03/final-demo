import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accordion } from './accordion';
import { AccordionItem } from '../accordion-item/accordion-item';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Accordion', () => {
  let component: Accordion;
  let fixture: ComponentFixture<Accordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accordion],
      schemas: [NO_ERRORS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(Accordion);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should close other items when notifyOpen is called and multi is false', () => {
    const mockItem1 = { isOpen: { set: vi.fn() } } as unknown as AccordionItem;
    const mockItem2 = { isOpen: { set: vi.fn() } } as unknown as AccordionItem;
    const openedItem = { isOpen: { set: vi.fn() } } as unknown as AccordionItem;

    vi.spyOn(component as any, 'items').mockReturnValue([
      mockItem1,
      mockItem2,
      openedItem,
    ]);

    component.notifyOpen(openedItem);

    expect(mockItem1.isOpen.set).toHaveBeenCalledWith(false);
    expect(mockItem2.isOpen.set).toHaveBeenCalledWith(false);
    expect(openedItem.isOpen.set).not.toHaveBeenCalled();
  });

  it('should not close items when multi is true', () => {
    const mockItem = { isOpen: { set: vi.fn() } } as unknown as AccordionItem;
    const openedItem = { isOpen: { set: vi.fn() } } as unknown as AccordionItem;

    vi.spyOn(component as any, 'items').mockReturnValue([mockItem, openedItem]);
    
    fixture.componentRef.setInput('multi', true);

    component.notifyOpen(openedItem);

    expect(mockItem.isOpen.set).not.toHaveBeenCalled();
  });
});