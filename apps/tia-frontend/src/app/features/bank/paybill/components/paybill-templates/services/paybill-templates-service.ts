import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateTemplateGroup,
  CreateTemplateGroupResponse,
  TemplateGroups,
  Templates,
} from '../models/paybill-templates.model';

@Injectable({
  providedIn: 'root',
})
export class PaybillTemplatesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/paybill`;

  public getAllTemplateGroups(): Observable<TemplateGroups[]> {
    return this.http.get<TemplateGroups[]>(`${this.baseUrl}/template-groups`);
  }

  public getAllTemplates(): Observable<Templates[]> {
    return this.http.get<Templates[]>(`${this.baseUrl}/templates`);
  }

  public createTemplateGroups(
    groupInfo: CreateTemplateGroup,
  ): Observable<CreateTemplateGroupResponse> {
    return this.http.post<CreateTemplateGroupResponse>(
      `${this.baseUrl}/template-groups`,
      {
        groupName: groupInfo.groupName,
        templateIds: groupInfo.templateIds,
      },
    );
  }

  public deleteTemplateGroups(groupId: string) {
    return this.http.delete(`${this.baseUrl}/template-groups/${groupId}`);
  }

  public deleteTemplate(templateId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/templates/${templateId}`,
    );
  }
}
