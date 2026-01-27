import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultAvatarResponse, CurrentUserAvatar, UploadAvatarResponse } from './profile-photo.state';

@Injectable({ providedIn: 'root' })
export class ProfilePhotoService {
  private http = inject(HttpClient);
  private readonly settingsApiUrl = `${environment.apiUrl}/settings`;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
    });
  }

  public getAvailableDefaultAvatars(): Observable<DefaultAvatarResponse[]> {

    return this.http.get<DefaultAvatarResponse[]>(
      `${this.settingsApiUrl}/get-available-default-avatars`,
      {
        headers: this.getHeaders(),
      },
    );
  }

  public selectFromDefaultAvatar(avatarId: string): Observable<void> {
    return this.http.put<void>(
      `${this.settingsApiUrl}/select-from-default-avatar`,
      { avatarId },
      {
        headers: this.getHeaders(),
      },
    );
  }

  public getCurrentUserAvatar(id: string): Observable<CurrentUserAvatar> {
    return this.http.get<CurrentUserAvatar>(
      `${this.settingsApiUrl}/current-user-avatar/${id}`,
      {
        headers: this.getHeaders(),
      },
    );
  }

  public uploadUserAvatar(file: File): Observable<UploadAvatarResponse> {
    const formData = new FormData();
    formData.append('file', file);

 
    const token = localStorage.getItem('accessToken') || '';
    const uploadHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      accept: 'application/json',
   
    });

    return this.http.post<UploadAvatarResponse>(
      `${this.settingsApiUrl}/upload-user-avatar`,
      formData,
      {
        headers: uploadHeaders,
      },
    );
  }

  public removeUserAvatar(): Observable<void> {
    return this.http.delete<void>(
      `${this.settingsApiUrl}/remove-user-avatar`,
      {
        headers: this.getHeaders(),
      },
    );
  }
}
