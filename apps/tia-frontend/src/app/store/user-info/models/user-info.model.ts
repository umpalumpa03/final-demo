import { IUserInfo } from "@tia/shared/models/user-info/user-info.models";
import { IWidgetItem } from "../../../features/bank/dashboard/models/widgets.model";

export interface IUserState extends IUserInfo {
  loaded: boolean;
  loading: boolean;
  error: string | null;
  widgets: IWidgetItem[]; 
  widgetsLoading: boolean;
}
