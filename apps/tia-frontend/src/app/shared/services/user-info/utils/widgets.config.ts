import {
  IWidgetItem,
  IWidgetTypes,
} from 'apps/tia-frontend/src/app/features/bank/dashboard/models/widgets.model';
import { IWidgetPayload } from '../widgets-service.api';
import { catalog } from 'apps/tia-frontend/src/app/features/bank/dashboard/config/widgets.config';

export const normalizeWidgetId = (backendName: string): string => {
  const lower = backendName.toLowerCase();
  if (lower.includes('transaction')) return 'transactions';
  if (lower.includes('exchange')) return 'exchange';
  if (lower.includes('account')) return 'accounts';
  return lower.replace(/\s+/g, '-');
};

export const mapToWidgetItem = (payload: IWidgetPayload): IWidgetItem => {
  const normalizedId = normalizeWidgetId(payload.widgetName);
  const catalogItem = catalog.find((c) => c.id === normalizedId);

  return {
    ...catalogItem,
    dbId: payload.id,
    id: normalizedId,
    type: normalizedId as IWidgetTypes,
    isHidden: !payload.isActive,
    hasFullWidth: payload.hasFullWidth,
    order: payload.order,
    title: catalogItem?.title || payload.widgetName,
    subtitle: catalogItem?.subtitle || '',
  };
};
