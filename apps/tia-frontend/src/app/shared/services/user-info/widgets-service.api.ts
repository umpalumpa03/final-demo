import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import {
  IWidgetItem,
  IWidgetTypes,
} from '../../../features/bank/dashboard/models/widgets.model';
import { map, Observable } from 'rxjs';
import { mapToWidgetItem, normalizeWidgetId } from './utils/widgets.config';

export interface IWidgetPayload {
  id: string;
  userId: string;
  widgetName: string;
  hasFullWidth: boolean;
  isCollapsed: boolean;
  isActive: boolean;
  order: number;
}

@Injectable({
  providedIn: 'root',
})
export class WidgetsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard-widgets`;

  public getWidgets(): Observable<IWidgetItem[]> {
    return this.http.get<IWidgetPayload[]>(this.baseUrl).pipe(
      map((widgets) => widgets.map((w) => mapToWidgetItem(w))),
      map((widgets) => widgets.sort((a, b) => a.order! - b.order!)),
    );
  }

  public createWidget(widget: IWidgetItem): Observable<IWidgetItem> {
    const payload = {
      widgetName: widget.title,
      hasFullWidth: widget.hasFullWidth,
      isCollapsed: widget.isHidden,
      isActive: true,
      order: widget.order,
    };

    return this.http.post<IWidgetItem>(this.baseUrl, payload);
  }

  public updateWidget(
    dbId: string,
    updates: Partial<IWidgetItem>,
  ): Observable<IWidgetItem> {
    const payload = {
      widgetName: updates.widgetName,
      isActive: updates.isHidden !== undefined ? !updates.isHidden : undefined,
      order: updates.order,
      hasFullWidth: updates.hasFullWidth,
    };

    if (updates.widgetName) payload.widgetName = updates.widgetName;
    if (updates.hasFullWidth !== undefined)
      payload.hasFullWidth = updates.hasFullWidth;
    if (updates.order !== undefined) payload.order = updates.order;

    return this.http
      .patch<IWidgetItem>(`${this.baseUrl}/${dbId}`, payload)
      .pipe(
        map((res: IWidgetItem) => {
          const normalizedId = normalizeWidgetId(
            res.widgetName || updates.widgetName || '',
          );
          return {
            ...res,
            dbId: res.id,
            isHidden: !res.isActive,
            id: normalizedId,
            type: normalizedId as IWidgetTypes,
          };
        }),
      );
  }

  public deleteWidget(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
