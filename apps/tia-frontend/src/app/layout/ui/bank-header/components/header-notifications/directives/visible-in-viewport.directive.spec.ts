import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { VisibleInViewportDirective } from './visible-in-viewport.directive';
import { describe, it, expect, beforeEach, vi } from 'vitest';

@Component({
  standalone: true,
  template: `<div
    [appVisibleInViewport]="'test-id'"
    [isRead]="isRead"
    (becameVisible)="onVisible($event)"
  ></div>`,
  imports: [VisibleInViewportDirective],
})
class TestHostComponent {
  isRead = false;
  onVisible = vi.fn();
}

describe('VisibleInViewportDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let observerCallback: any;

  beforeEach(async () => {
    globalThis.IntersectionObserver = class {
      constructor(callback: any) {
        observerCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    } as any;

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, VisibleInViewportDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(fixture).toBeTruthy();
  });

  it('should emit becameVisible when element intersects', () => {
    const mockEntry = { isIntersecting: true };
    observerCallback([mockEntry]);

    expect(component.onVisible).toHaveBeenCalledWith('test-id');
  });

  it('should not emit if isRead is true initially', async () => {
    component.onVisible.mockClear();
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.isRead = true;
    fixture.detectChanges();

    if (observerCallback) {
      observerCallback([{ isIntersecting: true }]);
    }

    expect(component.onVisible).not.toHaveBeenCalled();
  });
});
