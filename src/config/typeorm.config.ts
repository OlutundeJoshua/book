import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Books } from "src/books/entity/books";
import { DataSourceOptions } from "typeorm";

export const typeOrmConfig : DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'book',
  entities: [Books],
  synchronize: true,
}
