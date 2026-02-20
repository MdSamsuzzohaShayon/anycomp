import { IBaseEntity, ISoftDeletable } from "./common";
import { UserRole } from "./enums";

export interface IUser extends IBaseEntity, ISoftDeletable {
  email: string;
  role: UserRole;
  is_active: boolean;
  is_email_verified: boolean;
}
