import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from "config"
import { AuthEntity } from "src/authModule/authEntity/authEntity"
import { ApprovedContentEntity } from 'src/contentModule/contentEntity/approvedContentEntity';
import { ContentEntity } from 'src/contentModule/contentEntity/contentEntity';

const dbConfig: any | unknown = config.get("db")

if (!dbConfig) {
  throw new Error('Database configuration is missing');
}

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: dbConfig.type,
    host: process.env.RDS_HOSTNAME || dbConfig.host,
    port: process.env.RDS_PORT || dbConfig.port,
    username: process.env.RDS_USERNAME || dbConfig.username,
    password: process.env.RDS_PASSWORD || dbConfig.password,
    database: process.env.RDS_DB_NAME || dbConfig.database,
    entities: [
        AuthEntity,
        ContentEntity,
        ApprovedContentEntity,
    ],
    synchronize: process.env.TypeORM_SYNC || dbConfig.synchronize,
    // migrations: ["dist/migations/*.js"]
}