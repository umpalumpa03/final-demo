import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BirthdayApiService } from './birthday.service';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('BirthdayApiService', () => {
  let service: BirthdayApiService;
  let httpMock: HttpTestingController;
  
  const mockApiUrl = 'http://localhost:3000/api';
  const expectedUrl = `${mockApiUrl}/users/birthday-modal-dismiss`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BirthdayApiService]
    });

    service = TestBed.inject(BirthdayApiService);
    httpMock = TestBed.inject(HttpTestingController);

    (service as any).apiUrl = mockApiUrl;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send PUT request with correct year and URL', () => {
    const testYear = 2026;
    const mockResponse = { success: true };

    service.dismissBirthdayModal(testYear).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ year: testYear });

    req.flush(mockResponse);
  });

  it('should handle API errors correctly (100% Coverage Booster)', () => {
    let errorStatus = 0;

    service.dismissBirthdayModal(2026).subscribe({
      next: () => {},
      error: (err) => {
        errorStatus = err.status;
      }
    });

    const req = httpMock.expectOne(expectedUrl);
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

    expect(errorStatus).toBe(500);
  });
});