import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BankHeader } from './bank-header';
import { ActivatedRoute } from '@angular/router';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('BankHeader', () => {
  let fixture: ComponentFixture<BankHeader>;
  let component: BankHeader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankHeader],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(BankHeader);
    component = fixture.componentInstance;
  });

  it('should compute hasInboxMessages based on inboxCount', () => {
    fixture.componentRef.setInput('inboxCount', 0);
    expect(component.hasInboxMessages()).toBe(false);

    fixture.componentRef.setInput('inboxCount', 5);
    expect(component.hasInboxMessages()).toBe(true);
  });

  it('should compute initials correctly', () => {
    fixture.componentRef.setInput('fullName', 'John Doe');
    expect(component.initials()).toBe('JD');

    fixture.componentRef.setInput('fullName', 'single');
    expect(component.initials()).toBe('S');
  });

  it('should emit onNotificationClick when bellRef is present', () => {
    const emitSpy = vi.spyOn(component.onNotificationClick, 'emit');
    
    fixture.detectChanges(); 

    component.onNotification();

    if (window.innerWidth < 550) {
      expect(emitSpy).toHaveBeenCalledWith(null);
    } else {
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy.mock.calls[0][0]).not.toBeNull();
    }
  });

  it('should handle small screen logic for notification emission', () => {
    const emitSpy = vi.spyOn(component.onNotificationClick, 'emit');
    
    vi.stubGlobal('innerWidth', 500);
    fixture.detectChanges();

    component.onNotification();
    expect(emitSpy).toHaveBeenCalledWith(null);
    
    vi.unstubAllGlobals();
  });

  it('should accept hasUnread input', () => {
    fixture.componentRef.setInput('hasUnread', true);
    expect(component.hasUnread()).toBe(true);
  });
});