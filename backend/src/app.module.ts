import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BooksModule } from './books/books.module.js';
import { ExchangesModule } from './exchanges/exchanges.module.js';

import configuration from './config/configuration.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    SequelizeModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',

        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),

        username: configService.getOrThrow<string>('database.username'),
        password: configService.getOrThrow<string>('database.password'),
        database: configService.getOrThrow<string>('database.name'),

        autoLoadModels: true,
        synchronize: true,
        logging: false,
      }),
    }),

    UsersModule,

    AuthModule,

    BooksModule,

    ExchangesModule,
  ],
})
export class AppModule {}