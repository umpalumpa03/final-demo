import { 
  AlertStateType, 
  AlertType, 
  BaseAlertType, 
  DismissibleAlertType, 
  SimpleAlertType 
} from "@tia/shared/lib/alerts/shared/models/alert.models";

export interface BaseAlertItem {
  id: number;
  message: string;
}

export interface AlertBasicItem extends BaseAlertItem {
  type: BaseAlertType;
  state: AlertStateType;
  title: string;
}

export interface AlertIconItem extends BaseAlertItem {
  type: AlertType;
}

export interface AlertDismissibleItem extends BaseAlertItem {
  type: DismissibleAlertType;
  title: string;
}

export interface AlertActionItem extends BaseAlertItem {
  type: BaseAlertType;
  title: string;
  btnOneText: string;
  btnTwoText: string;
}

export interface AlertSimpleItem extends BaseAlertItem {
  type: SimpleAlertType;
}
