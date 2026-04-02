import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleCacheService } from './schedule-cache.service';
import { StationsCacheService } from './stations-cache.service';
import { TrainsCacheService } from './trains-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST', 'localhost'),
            port: configService.get<number>('REDIS_PORT', 6379),
          },
          ttl: 60 * 1000,
        }),
      }),
    }),
  ],
  providers: [ScheduleCacheService, StationsCacheService, TrainsCacheService],
  exports: [
    CacheModule,
    ScheduleCacheService,
    StationsCacheService,
    TrainsCacheService,
  ],
})
export class AppCacheModule {}
