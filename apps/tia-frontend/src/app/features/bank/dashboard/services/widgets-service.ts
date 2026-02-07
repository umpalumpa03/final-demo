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

  public readonly userWidgets = signal<IWidgetItem[]>([]);

  public getWidgets(): Observable<IWidgetItem[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map((widgets) =>
        widgets.map((w) => ({
          ...w,
          dbId: w.id,
          isHidden: !w.isActive,
          id: w.widgetName.toLowerCase(),
        })),
      ),
      tap((widgets) => this.userWidgets.set(widgets)),
    );
  }

  public createWidget(widget: Partial<IWidgetItem>): Observable<IWidgetItem> {
    const payload = {
      widgetName: widget.title,
      hasFullWidth: widget.hasFullWidth ?? false,
      isCollapsed: widget.isHidden ?? false,
      isActive: true,
      order: this.userWidgets().length + 1,
    };

    return this.http.post<IWidgetItem>(this.baseUrl, payload).pipe(
      tap((newWidget) => {
        this.userWidgets.update((current) => [...current, newWidget]);
      }),
    );
  }

  public updateWidget(
    id: string,
    updates: Partial<IWidgetItem>,
  ): Observable<IWidgetItem> {
    return this.http.patch<IWidgetItem>(`${this.baseUrl}/${id}`, updates).pipe(
      tap((updated) => {
        this.userWidgets.update((current) =>
          current.map((w) => (w.id === id ? updated : w)),
        );
      }),
    );
  }
}
