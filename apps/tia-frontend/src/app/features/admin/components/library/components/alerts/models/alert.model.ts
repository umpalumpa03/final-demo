import { BaseAlertType } from "@tia/shared/lib/alerts/shared/models/alert.models";

export interface AlertBasicItem {
  id: number;
  type: BaseAlertType; 
  title: string;
  message: string;
}