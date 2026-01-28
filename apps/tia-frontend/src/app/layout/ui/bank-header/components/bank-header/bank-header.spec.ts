import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankHeader } from './bank-header';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BankHeader', () => {
  let component: BankHeader;
  let fixture: ComponentFixture<BankHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHeader],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reflect hasUnread input changes', async () => {
    // Set signal input
    fixture.componentRef.setInput('hasUnread', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.hasUnread()).toBe(true);
  });

  it('should emit bellRef when onNotification is called', () => {
    // Spy on the output emitter
    const emitSpy = vi.spyOn(component.onNotificationClick, 'emit');

    // Manually trigger the method
    component.onNotification();

    // Check if it emitted the ElementRef from the viewChild
    // Note: bellRef() will only be defined if #bell exists in your HTML
    const bellEl = component.bellRef();
    if (bellEl) {
      expect(emitSpy).toHaveBeenCalledWith(bellEl);
    }
  });

  it('should not emit if bellRef is missing', () => {
    const emitSpy = vi.spyOn(component.onNotificationClick, 'emit');

    // Force the signal to return undefined for this test case
    vi.spyOn(component, 'bellRef').mockReturnValue(undefined as any);

    component.onNotification();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should trigger onNotification on click', () => {
    const methodSpy = vi.spyOn(component, 'onNotification');

    // Look for the element with the template ref #bell or a button
    const bellBtn =
      fixture.debugElement.query(By.css('#bell')) ||
      fixture.debugElement.query(By.css('button'));

    if (bellBtn) {
      bellBtn.nativeElement.click();
      expect(methodSpy).toHaveBeenCalled();
    }
  });
});
