import { IUserInfo } from "@tia/shared/models/user-info/user-info.models";

export interface IUserState extends IUserInfo {
  loaded: boolean;
  loading: boolean;
  error: string | null;
}
