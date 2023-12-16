import { DataSourceOptions } from 'typeorm';
import { EntityRegister } from './entity_register';

export const PostgreDataSource: DataSourceOptions = {
  type: 'postgres',
  host: 'dpg-clh23umf27hc739o4c90-a.singapore-postgres.render.com',
  port: 5432,
  username: 'io',
  password: 'rcmbko05O9TyHDhpAADzey57WiGXnUaF',
  database: 'io_lb8v',
  ssl: true,
  synchronize: true,
  logging: true,
  entities: EntityRegister,
  subscribers: [],
  migrations: [],
};
