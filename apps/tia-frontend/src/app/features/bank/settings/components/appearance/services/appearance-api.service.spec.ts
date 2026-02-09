import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AppearanceService } from './appearance-api.service';
import { environment } from '../../../../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AppearanceService', () => {
  let service: AppearanceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppearanceService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AppearanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch available themes and toggle isLoading', () => {
    const mockThemes = [{ name: 'Dark', value: 'dark-theme' }];

    expect(service.isLoading()).toBe(false);

    service.getAvailableThemes().subscribe((themes) => {
      expect(themes).toEqual(mockThemes);
      expect(service.isLoading()).toBe(false);
    });

    expect(service.isLoading()).toBe(true);

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/get-available-themes`);
    expect(req.request.method).toBe('GET');
    req.flush(mockThemes);
  });

  it('should call updateUserTheme with correct body', () => {
    const themeToSet = 'blue-theme';

    service.updateUserTheme(themeToSet).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/settings/update-user-theme`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ theme: themeToSet });
    req.flush({});
  });
});