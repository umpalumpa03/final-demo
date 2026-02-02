import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserManagementService } from './user-management.service';
import { environment } from '../../../../../../../../environments/environment';

describe('UserManagementService', () => {
  let service: UserManagementService;
  let httpMock: HttpTestingController;

  const url = `${environment.apiUrl}/users/management`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserManagementService,
      ],
    });

    service = TestBed.inject(UserManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAllUsers', () => {
    service.getAllUsers().subscribe((r) => expect(r.length).toBe(1));
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([{}]);
  });

  it('getUserById', () => {
    service.getUserById('1').subscribe((r) => expect(r).toBeTruthy());
    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('updateUser', () => {
    const body = {
      firstName: 'A',
      lastName: 'B',
      role: 'admin',
      isBlocked: false,
    };

    service.updateUser('1', body).subscribe((r) => expect(r).toBeTruthy());

    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('deleteUser', () => {
    service.deleteUser('1').subscribe((r) => expect(r.success).toBe(true));
    const req = httpMock.expectOne(`${url}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('blockUser', () => {
    service.blockUser('1', true).subscribe((r) => expect(r).toBeTruthy());
    const req = httpMock.expectOne(`${url}/1/block`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ isBlocked: true });
    req.flush({});
  });
});
