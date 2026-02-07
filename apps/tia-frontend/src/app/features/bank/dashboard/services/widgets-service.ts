import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'apps/tia-frontend/src/environments/environment';
import { IWidgetItem } from '../models/widgets.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WidgetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard-widgets`;

  private normalizeId(backendName: string): string {
    const lower = backendName.toLowerCase();

    if (lower.includes('transaction')) return 'transactions';

    if (lower.includes('exchange')) return 'exchange';

    if (lower.includes('account')) return 'accounts';

    return lower.replace(/\s+/g, '-');
  }

  public getWidgets(): Observable<IWidgetItem[]> {
    return this.http.get<IWidgetItem[]>(this.baseUrl).pipe(
      map((widgets: any[]) =>
        widgets.map((w) => {
          const normalizedId = w.widgetName
            ? this.normalizeId(w.widgetName)
            : '';

          return {
            ...w,
            dbId: w.id,
            isHidden: !w.isActive,
            id: normalizedId,
            type: normalizedId as any,
          };
        }),
      ),
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
    const payload: any = {
      isActive: updates.isHidden !== undefined ? !updates.isHidden : undefined,
    };

    if (updates.widgetName) payload.widgetName = updates.widgetName;
    if (updates.hasFullWidth !== undefined)
      payload.hasFullWidth = updates.hasFullWidth;
    if (updates.order !== undefined) payload.order = updates.order;

    return this.http
      .patch<IWidgetItem>(`${this.baseUrl}/${dbId}`, payload)
      .pipe(
        map((res: any) => {
          const normalizedId = this.normalizeId(
            res.widgetName || updates.widgetName || '',
          );
          return {
            ...res,
            dbId: res.id,
            isHidden: !res.isActive,
            id: normalizedId,
            type: normalizedId as any,
          };
        }),
      );
  }
}
