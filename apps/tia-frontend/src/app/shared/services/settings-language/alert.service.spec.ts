import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';
import { vi } from 'vitest';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show alert with success type', () => {
    service.showAlert('success', 'Test message');

    expect(service.alertType()).toBe('success');
    expect(service.alertMessage()).toBe('Test message');
  });

  it('should show alert with error type', () => {
    service.showAlert('error', 'Error message');

    expect(service.alertType()).toBe('error');
    expect(service.alertMessage()).toBe('Error message');
  });

  it('should auto-hide alert after default timeout', () => {
    service.showAlert('success', 'Test message');

    expect(service.alertType()).toBe('success');

    vi.advanceTimersByTime(3500);

    expect(service.alertType()).toBeNull();
    expect(service.alertMessage()).toBe('');
  });

  it('should auto-hide alert after custom timeout', () => {
    service.showAlert('success', 'Test message', 5000);

    expect(service.alertType()).toBe('success');

    vi.advanceTimersByTime(5000);

    expect(service.alertType()).toBeNull();
    expect(service.alertMessage()).toBe('');
  });

  it('should clear existing timeout when showing new alert', () => {
    service.showAlert('success', 'First message');
    
    vi.advanceTimersByTime(1000);
    
    service.showAlert('error', 'Second message');

    expect(service.alertType()).toBe('error');
    expect(service.alertMessage()).toBe('Second message');

    vi.advanceTimersByTime(2500);

    expect(service.alertType()).toBe('error');
  });

  it('should clear alert manually', () => {
    service.showAlert('success', 'Test message');

    expect(service.alertType()).toBe('success');

    service.clearAlert();

    expect(service.alertType()).toBeNull();
    expect(service.alertMessage()).toBe('');
  });

  it('should clear timeout when clearing alert manually', () => {
    service.showAlert('success', 'Test message');

    service.clearAlert();

    vi.advanceTimersByTime(3500);

    expect(service.alertType()).toBeNull();
  });

  it('should handle clearAlert when no alert is active', () => {
    service.clearAlert();

    expect(service.alertType()).toBeNull();
    expect(service.alertMessage()).toBe('');
  });
});
