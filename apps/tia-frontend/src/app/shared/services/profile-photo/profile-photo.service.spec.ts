import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProfilePhotoApiService } from './profile-photo.service';
import { environment } from '../../../../environments/environment';
import {
 UploadAvatarResponse,
} from '../../../features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.state';

describe('ProfilePhotoApiService', () => {
  let service: ProfilePhotoApiService;
  let httpMock: HttpTestingController;
  const settingsApiUrl = `${environment.apiUrl}/settings`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfilePhotoApiService, provideHttpClientTesting()],
    });

    service = TestBed.inject(ProfilePhotoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });



  it('should select from default avatar', () => {
    const avatarId = 'avatar-123';

    service.selectFromDefaultAvatar(avatarId).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(
      `${settingsApiUrl}/select-from-default-avatar`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ avatarId });
    req.flush(null);
  });



  it('should upload user avatar', () => {
    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    const mockResponse: UploadAvatarResponse = {
      success: true,
      avatarId: 'avatar-1',
    } as UploadAvatarResponse;

    service.uploadUserAvatar(file).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${settingsApiUrl}/upload-user-avatar`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);
    expect(req.request.body.has('file')).toBe(true);

    req.flush(mockResponse);
  });

  it('should remove user avatar', () => {
    service.removeUserAvatar().subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(
      `${settingsApiUrl}/remove-user-avatar`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

