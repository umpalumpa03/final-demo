import { TestBed } from '@angular/core/testing';
import { ModalResponsiveService } from './service-modal';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {
  calculateModalPositions,
  toggleBodyScroll,
} from '../config/ui-modal.config';
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';

vi.mock('../config/ui-modal.config', () => ({
  calculateModalPositions: vi.fn(),
  toggleBodyScroll: vi.fn(),
}));

class MockResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
vi.stubGlobal('ResizeObserver', MockResizeObserver);

describe('ModalResponsiveService', () => {
  let service: ModalResponsiveService;
  let mockDocument: any;
  let mockElement: any;

  const PADDING = 10;
  const GAP = 5;
  const PLACEMENT = 'bottom';
  const OFFSET = { top: 0 };

  beforeEach(() => {
    vi.clearAllMocks();

    mockElement = {
      offsetParent: {},
      getBoundingClientRect: vi.fn(),
    } as any;

    mockDocument = {
      getElementById: vi.fn().mockReturnValue(mockElement),
      body: {
        contains: vi.fn(() => true),
        style: {},
      },
    };

    TestBed.configureTestingModule({
      providers: [
        ModalResponsiveService,
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    service = TestBed.inject(ModalResponsiveService);
  });

  afterEach(() => {
    service.stopTracking();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('startTracking', () => {
    it('should accept direct HTMLElement and call updatePosition', () => {
      const updateSpy = vi.spyOn(service, 'updatePosition');
      (calculateModalPositions as Mock).mockReturnValue({
        isFallback: false,
        spotlightStyle: {},
        cardStyle: {},
      });

      service.startTracking(mockElement, PADDING, GAP, PLACEMENT, OFFSET);

      expect(updateSpy).toHaveBeenCalledWith(
        mockElement,
        PADDING,
        GAP,
        PLACEMENT,
        OFFSET,
      );
    });

    it('should retry if element is missing initially, then find it', () => {
      vi.useFakeTimers();

      mockDocument.getElementById
        .mockReturnValueOnce(null)
        .mockReturnValue(mockElement);

      const updateSpy = vi.spyOn(service, 'updatePosition');

      (calculateModalPositions as Mock).mockReturnValue({
        isFallback: false,
        spotlightStyle: {},
        cardStyle: {},
      });

      service.startTracking('lazy-id', PADDING, GAP, PLACEMENT, OFFSET);

      expect(updateSpy).toHaveBeenCalledWith(
        null,
        PADDING,
        GAP,
        PLACEMENT,
        OFFSET,
      );

      vi.advanceTimersByTime(100);

      expect(updateSpy).toHaveBeenCalledWith(
        mockElement,
        PADDING,
        GAP,
        PLACEMENT,
        OFFSET,
      );

      expect(mockDocument.getElementById).toHaveBeenCalledTimes(2);
    });
  });

  
});
