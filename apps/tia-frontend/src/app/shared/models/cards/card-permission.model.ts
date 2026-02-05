export interface CardPermission {
  value: 'allowAtm' | 'allowOnlinePayments' | 'allowInternational';
  displayName: string;
}

export type CardPermissionsResponse = CardPermission[];