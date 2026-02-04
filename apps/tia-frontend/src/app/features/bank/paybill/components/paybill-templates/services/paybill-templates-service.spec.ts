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

  describe('POST, PATCH & DELETE Operations', () => {
    it('should call renameTemplate and return the updated template', () => {
      const templateId = 'temp-1';
      const newName = 'Internet Bill';
      const mockResponse = { id: templateId, nickname: newName };

      service.renameTemplate(templateId, newName).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/paybill/templates/${templateId}`,
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ nickname: newName });
      req.flush(mockResponse);
    });

    it('should call deleteGroup and return success message', () => {
      const groupId = 'group-789';
      const mockResponse = { message: 'Group deleted' };

      service.deleteGroup(groupId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/paybill/template-groups/${groupId}`,
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should call renameGroup and return updated group', () => {
      const groupId = 'group-1';
      const newName = 'House Utilities';
      const mockResponse = { id: groupId, groupName: newName };

      service.renameGroup(groupId, newName).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.apiUrl}/paybill/template-groups/${groupId}`,
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ groupName: newName });
      req.flush(mockResponse);
    });
  });
});
