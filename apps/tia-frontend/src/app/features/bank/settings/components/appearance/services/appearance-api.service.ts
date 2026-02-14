import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { TAvailableThemes } from "../models/appearance.model";
import { environment } from "../../../../../../../environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
}) 
export class AppearanceService {
    private readonly BASE_URL = environment.apiUrl;
    private readonly AVAILABLE_THEMES_ENDPOINT = '/settings/get-available-themes';
    private readonly UPDATE_THEMES_ENDPOINT = '/settings/update-user-theme';
    
    private http = inject(HttpClient);

    public getAvailableThemes(): Observable<TAvailableThemes> {
        return this.http.get<TAvailableThemes>(`${this.BASE_URL}${this.AVAILABLE_THEMES_ENDPOINT}`)
    }

    public updateUserTheme(theme: string): Observable<void> {
        return this.http.put<void>(`${this.BASE_URL}${this.UPDATE_THEMES_ENDPOINT}`, { theme });
    }
}