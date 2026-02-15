import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tooltip } from './tooltip';
import { describe, it, expect, beforeEach } from 'vitest';

describe('Tooltip', () => {
  let component: Tooltip;
  let fixture: ComponentFixture<Tooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tooltip],
    }).compileComponents();

    fixture = TestBed.createComponent(Tooltip);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('content', 'Tooltip content');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close', () => {
    expect(component.isOpen()).toBe(false);

    component.open();
    expect(component.isOpen()).toBe(true);

    component.close();
    expect(component.isOpen()).toBe(false);
  });

  it('should not open when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    component.open();
    expect(component.isOpen()).toBe(false);
  });

  it('should compute correct position strategy for top', () => {
    fixture.componentRef.setInput('placement', 'top');
    fixture.detectChanges();
    const pos = component.positionStrategy()[0];
    expect(pos.originY).toBe('top');
    expect(pos.overlayY).toBe('bottom');
  });

  it('should compute correct position strategy for bottom', () => {
    fixture.componentRef.setInput('placement', 'bottom');
    fixture.detectChanges();
    const pos = component.positionStrategy()[0];
    expect(pos.originY).toBe('bottom');
    expect(pos.overlayY).toBe('top');
  });

  it('should compute correct position strategy for left', () => {
    fixture.componentRef.setInput('placement', 'left');
    fixture.detectChanges();
    const pos = component.positionStrategy()[0];
    expect(pos.originX).toBe('start');
    expect(pos.overlayX).toBe('end');
  });

  it('should compute correct position strategy for right', () => {
    fixture.componentRef.setInput('placement', 'right');
    fixture.detectChanges();
    const pos = component.positionStrategy()[0];
    expect(pos.originX).toBe('end');
    expect(pos.overlayX).toBe('start');
  });

  it('should fallback to top for unknown placement', () => {
    fixture.componentRef.setInput('placement', 'unknown' as any);
    fixture.detectChanges();
    const pos = component.positionStrategy()[0];
    expect(pos.originY).toBe('top');
    expect(pos.offsetY).toBe(-8);
  });
});
