import { IBaseEntity, ISoftDeletable } from "./common";
import { MediaType, MimeType } from "./enums";
import { ISpecialist } from "./specialist";

export interface IMedia extends IBaseEntity, ISoftDeletable {
  file_name: string;
  file_size: number;
  display_order: number;
  media_type: MediaType;
  mime_type: MimeType;
  uploaded_at: string;

  specialist?: ISpecialist; // optional to avoid circular pain
}
