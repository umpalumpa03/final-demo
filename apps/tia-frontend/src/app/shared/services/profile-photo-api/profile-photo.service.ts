import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DefaultAvatarResponse, CurrentUserAvatar, UploadAvatarResponse } from '../../../store/profile-photo/profile-photo.state';

@Injectable({ providedIn: 'root' })
export class ProfilePhotoService {
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

  public getCurrentUserAvatar(id: string): Observable<CurrentUserAvatar> {
    return this.http.get<CurrentUserAvatar>(
      `${this.settingsApiUrl}/current-user-avatar/${id}`,
    );
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
    return this.http.delete<void>(
      `${this.settingsApiUrl}/remove-user-avatar`,
    );
  }
}
