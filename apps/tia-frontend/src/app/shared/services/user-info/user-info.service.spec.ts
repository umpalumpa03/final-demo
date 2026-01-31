import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserInfoService } from './user-info.service';
import { environment } from '../../../../environments/environment';

describe('UserInfoService', () => {
  let service: UserInfoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [UserInfoService] });
    service = TestBed.inject(UserInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('getUserInfo calls current-user endpoint', () => {
    service.getUserInfo().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/users/current-user`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('searchByEmail calls search-by-email with params', () => {
    service.searchByEmail('a@b.com').subscribe();
    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/users/search-by-email` && r.params.get('email') === 'a@b.com');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});
