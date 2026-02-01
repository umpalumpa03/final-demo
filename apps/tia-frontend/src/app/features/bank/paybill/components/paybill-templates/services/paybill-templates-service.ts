import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Observable } from 'rxjs';
import { TableGroups } from '../models/paybill-templates.model';

@Injectable({
  providedIn: 'root',
})
export class PaybillTemplatesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/paybill`;

  public getAllTemplateGroups(): Observable<TableGroups[]> {
    return this.http.get<TableGroups[]>(`${this.baseUrl}/template-groups`);
  }
}
