import { AlertStateType, AlertType, BaseAlertType, DismissibleAlertType, SimpleAlertType } from "@tia/shared/lib/alerts/shared/models/alert.models";

export interface AlertBasicItem {
  id: number;
  type: BaseAlertType; 
  title: string;
  message: string;
}

export interface AlertIconItem {
  id: number;
  type: AlertType;
  message: string;
}

export interface AlertDismissibleItem {
  id: number;
  type: DismissibleAlertType;
  title: string;
  message: string;
}

export interface AlertActionItem {
  id:number;
  type:BaseAlertType;
  title: string;
  message:string;
  btnOneText: string;
  btnTwoText: string;
}

export interface AlertSimpleItem {
  id:number;
  type: SimpleAlertType;
  message: string;
}

export interface AlertStateItem {
  id: number;
  state: AlertStateType;
  title: string;
  message: string;
}