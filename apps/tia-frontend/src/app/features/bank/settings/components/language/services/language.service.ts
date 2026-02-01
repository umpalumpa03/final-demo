import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "apps/tia-frontend/src/environments/environment";
import { TLanguages } from "../models/language.model";
import { Observable } from "rxjs";

@Injectable()

export class LanguageService {
    private readonly BASE_URL = environment.apiUrl;
    private readonly AVAILABLE_LANGUAGES_ENDPOINT = '/settings/get-available-languages';
    private readonly UPDATE_LANGUAGE_ENDPOINT = '/settings/update-user-language';
    
    private http = inject(HttpClient);

    public getAvailableLanguages(): Observable<TLanguages> {
        return this.http.get<TLanguages>(`${this.BASE_URL}${this.AVAILABLE_LANGUAGES_ENDPOINT}`);
    }

    public updateUserLanguage(language: string): Observable<{successs: boolean}> {
        return this.http.post<{successs: boolean}>(`${this.BASE_URL}${this.UPDATE_LANGUAGE_ENDPOINT}`, { language });
    }
}