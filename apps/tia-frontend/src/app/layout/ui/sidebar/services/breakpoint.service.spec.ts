import { TestBed } from '@angular/core/testing';
import { BreakpointService } from './breakpoint.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('BreakpointService (vitest)', () => {
  let service: BreakpointService;

  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1200);
    
    TestBed.configureTestingModule({
      providers: [BreakpointService]
    });
    service = TestBed.inject(BreakpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update signals to true when window is resized to Mobile', () => {
    vi.stubGlobal('innerWidth', 375);
    
    window.dispatchEvent(new Event('resize'));

    expect(service.isMobile()).toBe(true);
    expect(service.isTablet()).toBe(true);
  });


  it('should update signals to false when resized back to Desktop', () => {
    vi.stubGlobal('innerWidth', 375);
    window.dispatchEvent(new Event('resize'));
    
    vi.stubGlobal('innerWidth', 1440);
    window.dispatchEvent(new Event('resize'));

    expect(service.isMobile()).toBe(false);
    expect(service.isTablet()).toBe(false);
  });

});