import { TestBed } from '@angular/core/testing';
import { BankHeader } from './bank-header';
import { ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('BankHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHeader],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();
  });

  it('should compute hasInboxMessages based on inboxCount', () => {
    const fixture = TestBed.createComponent(BankHeader);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('inboxCount', 0);
    expect(component.hasInboxMessages()).toBe(false);

    fixture.componentRef.setInput('inboxCount', 5);
    expect(component.hasInboxMessages()).toBe(true);
  });

  it('should emit onNotificationClick when bellRef is present', () => {
    const fixture = TestBed.createComponent(BankHeader);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.onNotificationClick, 'emit');

    const mockEl = { nativeElement: {} } as ElementRef;
    vi.spyOn(component, 'bellRef').mockReturnValue(mockEl);

    component.onNotification();

    expect(emitSpy).toHaveBeenCalledWith(mockEl);
  });

  it('should not emit if bellRef is undefined', () => {
    const fixture = TestBed.createComponent(BankHeader);
    const component = fixture.componentInstance;
    const emitSpy = vi.spyOn(component.onNotificationClick, 'emit');

    vi.spyOn(component, 'bellRef').mockReturnValue(undefined);

    component.onNotification();

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should accept hasUnread input', () => {
    const fixture = TestBed.createComponent(BankHeader);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('hasUnread', true);
    expect(component.hasUnread()).toBe(true);
  });
});
