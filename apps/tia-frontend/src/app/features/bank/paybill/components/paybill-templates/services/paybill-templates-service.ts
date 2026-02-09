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
import { TreeItem } from '@tia/shared/lib/drag-n-drop/model/drag.model';

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

  public deleteTemplate(templateId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/templates/${templateId}`,
    );
  }

  public renameTemplate(
    templateId: string,
    newName: string,
  ): Observable<Templates> {
    return this.http.patch<Templates>(
      `${this.baseUrl}/templates/${templateId}`,
      {
        nickname: newName,
      },
    );
  }

  public deleteGroup(groupId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/template-groups/${groupId}`,
    );
  }

  public renameGroup(
    groupId: string,
    groupName: string,
  ): Observable<TemplateGroups> {
    return this.http.patch<TemplateGroups>(
      `${this.baseUrl}/template-groups/${groupId}`,
      { groupName },
    );
  }

  public removeTemplateFromGroup(templateId: string): Observable<Templates> {
    return this.http.patch<Templates>(
      `${this.baseUrl}/templates/${templateId}/ungroup`,
      {},
    );
  }

  public addTemplateToGroup(
    groupId: string | null,
    template: string,
  ): Observable<TemplateGroups> {
    return this.http.patch<TemplateGroups>(
      `${this.baseUrl}/template-groups/${groupId}/add-templates`,
      { templateIds: [template] },
    );
  }

  // Filter Logic
  public filterTemplatesAndGroups(
    searchValue: string,
    templates: TreeItem[],
    groups: TemplateGroups[],
  ): { templates: TreeItem[]; groups: TemplateGroups[] } {
    const lowerSearchTerm = searchValue.toLowerCase().trim();

    if (!lowerSearchTerm) {
      return { templates, groups };
    }

    const filteredTemplates = templates.filter((template) =>
      template.title?.toLowerCase().includes(lowerSearchTerm),
    );
    const filteredGroups = groups.filter((group) =>
      group.groupName?.toLowerCase().includes(lowerSearchTerm),
    );

    return { templates: filteredTemplates, groups: filteredGroups };
  }
}
