import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollArea } from './scroll-area';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ScrollArea', () => {
  let component: ScrollArea;
  let fixture: ComponentFixture<ScrollArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollArea],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollArea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and verify default computed states', () => {
    expect(component).toBeTruthy();
    expect(component.isVertical()).toBe(true);
    expect(component.isHorizontal()).toBe(false);
    expect(component.isScrollbarVisible()).toBe(true);
  });

  it('should update computed states based on inputs', () => {
    fixture.componentRef.setInput('direction', 'horizontal');
    fixture.componentRef.setInput('scrollbar', 'hidden');
    fixture.detectChanges();

    expect(component.isHorizontal()).toBe(true);
    expect(component.isVertical()).toBe(false);
    expect(component.isScrollbarVisible()).toBe(false);
  });

  it('should apply correct CSS classes and styles', () => {
    fixture.componentRef.setInput('height', '500px');
    fixture.componentRef.setInput('direction', 'horizontal');
    fixture.detectChanges();

    const element = fixture.debugElement.query(
      By.css('.ta-scroll-area'),
    ).nativeElement;
    expect(element.classList).toContain('horizontal');
    expect(element.style.height).toBe('500px');
  });

  it('should emit retry on button click', () => {
    const emitSpy = vi.spyOn(component.retry, 'emit');
    component.onButtonClick();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit scrollBottom when scroll position is within threshold', () => {
    const emitSpy = vi.spyOn(component.scrollBottom, 'emit');

    const mockEl = {
      scrollHeight: 1000,
      scrollTop: 800,
      clientHeight: 200,
    } as HTMLElement;

    (component as any).checkScrollPosition(mockEl);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should reset emission state and trigger check onScroll', () => {
    const emitSpy = vi.spyOn(component.scrollBottom, 'emit');

    const mockEl = {
      scrollHeight: 1000,
      scrollTop: 900,
      clientHeight: 100,
    };

    Object.defineProperty(component, 'viewport', {
      value: () => ({ nativeElement: mockEl }),
    });

    component.onScroll();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should hit early return in onScroll when isLoading is true', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const checkSpy = vi.spyOn(component as any, 'checkScrollPosition');
    component.onScroll();

    expect(checkSpy).not.toHaveBeenCalled();
  });
});
