import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoConnection } from './no-connection';
import { TranslateModule } from '@ngx-translate/core';
import { NoConnectionService } from '../service/no-connection.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NoConnection', () => {
  let component: NoConnection;
  let fixture: ComponentFixture<NoConnection>;
  let mockNoConnectionService: any;

  beforeEach(async () => {
    mockNoConnectionService = {
      isOnline: vi.fn().mockReturnValue(true),
      onOnline: vi.fn(),
      onOffline: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NoConnection, TranslateModule.forRoot()],
      providers: [
        { provide: NoConnectionService, useValue: mockNoConnectionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NoConnection);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not open modal if online on init', () => {
    mockNoConnectionService.isOnline.mockReturnValue(true);

    component.ngOnInit();

    expect(component.isModalOpen()).toBe(false);
  });

  it('should open modal if offline on init', () => {
    mockNoConnectionService.isOnline.mockReturnValue(false);

    component.ngOnInit();

    expect(component.isModalOpen()).toBe(true);
  });

  it('should set reconnected and close modal after delay when onOnline is called', () => {
    vi.useFakeTimers();
    component.ngOnInit();

    mockNoConnectionService.onOnline();

    expect(component.isReconnected()).toBe(true);
    
    vi.advanceTimersByTime(2000);

    expect(component.isReconnected()).toBe(false);

    vi.useRealTimers();
  });

  it('should open modal and reset reconnected when onOffline is called', () => {
    component.ngOnInit();

    mockNoConnectionService.onOffline();

    expect(component.isReconnected()).toBe(false);
    expect(component.isModalOpen()).toBe(true);
  });
});
