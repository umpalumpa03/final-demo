import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DefaultAvatarResponse,
  UploadAvatarResponse,
} from '../../../features/bank/settings/components/profile-photo/store/profile-photo/profile-photo.state';

@Injectable({ providedIn: 'root' })
export class ProfilePhotoApiService {
  private http = inject(HttpClient);
  private readonly settingsApiUrl = `${environment.apiUrl}/settings`;

  public getAvailableDefaultAvatars(): Observable<DefaultAvatarResponse[]> {
    return this.http.get<DefaultAvatarResponse[]>(
      `${this.settingsApiUrl}/get-available-default-avatars`,
    );
  }

  public selectFromDefaultAvatar(avatarId: string): Observable<void> {
    return this.http.put<void>(
      `${this.settingsApiUrl}/select-from-default-avatar`,
      { avatarId },
    );
  }

  public getCurrentUserAvatar(id: string): Observable<Blob> {
    return this.http.get(`${this.settingsApiUrl}/current-user-avatar/${id}`, {
      responseType: 'blob',
    });
  }

  public uploadUserAvatar(file: File): Observable<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadAvatarResponse>(
      `${this.settingsApiUrl}/upload-user-avatar`,
      formData,
    );
  }

  public removeUserAvatar(): Observable<void> {
    return this.http.delete<void>(`${this.settingsApiUrl}/remove-user-avatar`);
  }
}
