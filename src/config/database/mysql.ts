import { DataSourceOptions } from 'typeorm';
import { EntityRegister } from './entity_register';

export const MySQLDataSource: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'test',
  ssl: false,
  synchronize: true,
  logging: true,
  entities: EntityRegister,
  subscribers: [],
  migrations: [],
};
