import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './authModule/authModule';
import { ContentModule } from './contentModule/contentModule';
import { typeOrmConfig } from './typeorm.config/typeorm.config';


@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ContentModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule {}
