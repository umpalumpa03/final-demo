import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach } from 'vitest';
import { PaybillTemplatesService } from './paybill-templates-service';
import { environment } from '../../../../../../../environments/environment';

describe('PaybillTemplatesService', () => {
  let service: PaybillTemplatesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PaybillTemplatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAllTemplateGroups', () => {
    service.getAllTemplateGroups().subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/paybill/template-groups`,
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call getAllTemplates', () => {
    service.getAllTemplates().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/paybill/templates`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  describe('POST & DELETE Operations', () => {
    it('should call deleteTemplateGroups with the correct groupId', () => {
      const groupId = 'group-123';

      service.deleteTemplateGroups(groupId).subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/paybill/template-groups/${groupId}`,
      );
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should call deleteTemplate and return a success message', () => {
      const templateId = 'temp-456';
      const mockResponse = { message: 'Template deleted successfully' };

      service.deleteTemplate(templateId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/paybill/templates/${templateId}`,
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
