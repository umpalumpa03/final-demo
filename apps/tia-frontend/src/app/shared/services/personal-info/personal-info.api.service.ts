import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { PersonalInfoDto, UpdatePersonalInfoDto } from "../../../store/personal-info/personal-info.state";



@Injectable({ providedIn: 'root' })
export class PersonalInfoApiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/settings/personal-info`;

    public getPersonalInfo(): Observable<PersonalInfoDto> {
        return this.http.get<PersonalInfoDto>(this.baseUrl);
    }

    public updatePersonalInfo(payload: UpdatePersonalInfoDto): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(this.baseUrl, payload);
    }
}