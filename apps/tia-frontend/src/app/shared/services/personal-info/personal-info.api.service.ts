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

    public initiatePhoneUpdate(phone: string): Observable<{ challengeId: string; method: string }> {
        return this.http.post<{ challengeId: string; method: string }>(`${this.baseUrl}/update-phone`, { phone });
    }

    public verifyPhoneUpdate(challengeId: string, code: string): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.baseUrl}/verify-new-phone-otp`, { challengeId, code });
    }

    public resendPhoneOtp(challengeId: string): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.baseUrl}/resend-phone-otp`, { challengeId });
    }
}