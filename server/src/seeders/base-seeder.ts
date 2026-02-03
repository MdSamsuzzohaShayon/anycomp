import { DataSource } from "typeorm";

export abstract class BaseSeeder {
  protected dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  abstract seed(): Promise<void>;
  abstract truncate(): Promise<void>;
}