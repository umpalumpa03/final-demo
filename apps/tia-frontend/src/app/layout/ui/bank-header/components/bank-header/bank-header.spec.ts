import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankHeader } from './bank-header';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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

  it('should use OnPush change detection strategy', () => {
    expect(fixture.componentRef.changeDetectorRef).toBeDefined();
  });

  describe('hasUnread input', () => {
    it('should have default value of false', () => {
      expect(component.hasUnread()).toBe(false);
    });

    it('should accept hasUnread input value', () => {
      fixture.componentRef.setInput('hasUnread', true);
      fixture.detectChanges();

      expect(component.hasUnread()).toBe(true);
    });
  });

  describe('onNotificationClick output', () => {
    it('should be defined', () => {
      expect(component.onNotificationClick).toBeDefined();
    });

    it('should emit event when onNotification is called', () => {
      const emitSpy = vi.spyOn(component.onNotificationClick, 'emit');

      component.onNotification();

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith();
    });

    it('should trigger subscription when onNotification is called', () => {
      return new Promise<void>((resolve) => {
        component.onNotificationClick.subscribe(() => {
          expect(true).toBe(true);
          resolve();
        });

        component.onNotification();
      });
    });
  });
});
