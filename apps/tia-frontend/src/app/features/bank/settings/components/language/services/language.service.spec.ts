import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LanguageService } from './language.service';
import { environment } from '../../../../../../../environments/environment';

describe('LanguageService', () => {
  let service: LanguageService;
  let httpMock: HttpTestingController;

  const BASE_URL = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(LanguageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAvailableLanguages', () => {
    it('should call GET with correct URL and return languages', () => {
      const mockLanguages = [
        { code: 'en', label: 'English' },
        { code: 'ka', label: 'Georgian' },
      ];

      service.getAvailableLanguages().subscribe((languages) => {
        expect(languages).toEqual(mockLanguages);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/settings/get-available-languages`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockLanguages);
    });
  });

  describe('updateUserLanguage', () => {
    it('should call PUT with correct URL and body', () => {
      const mockResponse = { successs: true };
      const language = 'ka';

      service.updateUserLanguage(language).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${BASE_URL}/settings/update-user-language`,
      );
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ language: 'ka' });
      req.flush(mockResponse);
    });
  });
});
