export interface IBaseEntity {
    id: string;
    created_at: string; // ISO string from API
    updated_at: string;
  }
  
  export interface ISoftDeletable {
    deleted_at?: string | null;
  }
  