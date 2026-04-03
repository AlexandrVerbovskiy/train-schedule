import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TrainsModule } from './trains/trains.module';
import { StationsModule } from './stations/stations.module';
import { Train } from './trains/entities/train.entity';
import { Station } from './stations/entities/station.entity';
import { RoutePoint } from './trains/entities/route-point.entity';

import { FavoritesModule } from './favorites/favorites.module';
import { Favorite } from './favorites/entities/favorite.entity';
import { EventsModule } from './events/events.module';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [
    AppCacheModule,
    EventsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST!,
      port: Number(process.env.DB_PORT!),
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      entities: [User, Train, Station, RoutePoint, Favorite],
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'dev' || true,
    }),
    DatabaseModule,
    AuthModule,
    TrainsModule,
    StationsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
