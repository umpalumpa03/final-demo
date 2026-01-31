import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { TAvailableThemes } from "../models/appearance.model";
import { environment } from "../../../../../../../environments/environment";
import { tap } from "rxjs";

@Injectable({
    providedIn: 'root'
}) 
export class AppearanceService {
    private readonly BASE_URL = environment.apiUrl;
    private readonly AVAILABLE_THEMES_ENDPOINT = '/settings/get-available-themes';
    private readonly UPDATE_THEMES_ENDPOINT = '/settings/update-user-themes';
    
    private http = inject(HttpClient);

    public isLoading = signal(false);    

    public getAvailableThemes() {
        this.isLoading.set(true);
        return this.http.get<TAvailableThemes>(`${this.BASE_URL}${this.AVAILABLE_THEMES_ENDPOINT}`).pipe(
            tap(() => this.isLoading.set(false)),
        );
    }

    public updateUserTheme(theme: string) {
        return this.http.put(`${this.BASE_URL}${this.UPDATE_THEMES_ENDPOINT}`, { theme });
    }
}