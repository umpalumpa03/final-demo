import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WidgetsApiService } from './widgets-service.api';
import { IWidgetItem } from '../../../features/bank/dashboard/models/widgets.model';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('apps/tia-frontend/src/environments/environment', () => ({
  environment: {
    apiUrl: 'https://tia.up.railway.app'
  },
}));

describe('WidgetsApiService', () => {
  let service: WidgetsApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://tia.up.railway.app/dashboard-widgets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WidgetsApiService],
    });

    service = TestBed.inject(WidgetsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWidgets', () => {
    it('should fetch, map, and sort widgets by order', () => {
      const mockPayload = [
        { id: 'w2', widgetName: 'TRANSACTIONS', order: 2, isActive: true },
        { id: 'w1', widgetName: 'ACCOUNTS', order: 1, isActive: true },
      ];

      service.getWidgets().subscribe((widgets) => {
        expect(widgets.length).toBe(2);
        expect(widgets[0].order).toBe(1);
        expect(widgets[1].order).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockPayload);
    });
  });

  describe('createWidget', () => {
    it('should send a POST request with a correctly mapped payload', () => {
      const mockWidget: IWidgetItem = {
        subtitle: 'gelaaaaaaa',
        title: 'New Widget',
        hasFullWidth: true,
        isHidden: false,
        order: 5,
        id: 'new-id',
        type: 'transactions'
      };

      service.createWidget(mockWidget).subscribe();

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        widgetName: 'New Widget',
        hasFullWidth: true,
        isCollapsed: false,
        isActive: true,
        order: 5,
      });
      req.flush({});
    });
  });

  describe('updateWidget', () => {
    it('should send a PATCH request and normalize the response', () => {
      const updates = { order: 10, hasFullWidth: true, isHidden: true };
      
      service.updateWidget('db-123', updates).subscribe((res) => {
        expect(res.dbId).toBe('db-123');
        expect(res.isHidden).toBe(true);
      });

      const req = httpMock.expectOne(`${baseUrl}/db-123`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body.isActive).toBe(false);
      
      req.flush({ 
        id: 'db-123', 
        widgetName: 'TRANSACTIONS', 
        isActive: false,
        order: 10 
      });
    });

    it('should include widgetName in payload if provided in updates', () => {
      service.updateWidget('db-123', { widgetName: 'Updated Title' }).subscribe();
      const req = httpMock.expectOne(`${baseUrl}/db-123`);
      expect(req.request.body.widgetName).toBe('Updated Title');
      req.flush({});
    });
  });

  describe('deleteWidget', () => {
    it('should send a DELETE request to the correct resource ID', () => {
      service.deleteWidget('db-999').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/db-999`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});