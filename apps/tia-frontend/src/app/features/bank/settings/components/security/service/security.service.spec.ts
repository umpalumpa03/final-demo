import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { SecurityService } from './security.service';
import { environment } from '../../../../../../../environments/environment';

describe('SecurityService', () => {
  let service: SecurityService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SecurityService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SecurityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send POST request to change password endpoint', () => {
    const currentPassword = 'oldPassword123';
    const newPassword = 'newPassword456';

    service.changePassword(currentPassword, newPassword).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/settings/change-password`,
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      currentPassword,
      newPassword,
    });

    req.flush(null);
  });
});