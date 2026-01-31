import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { Observable } from 'rxjs';
import { TemplateGroups } from '../models/paybill-templates.model';

@Injectable({
  providedIn: 'root',
})
export class PaybillTemplatesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/paybill`;

  public getAllTemplateGroups(): Observable<TemplateGroups[]> {
    return this.http.get<TemplateGroups[]>(`${this.baseUrl}/template-groups`);
  }
}
