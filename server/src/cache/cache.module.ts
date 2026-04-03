import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { StationsCacheService } from './stations-cache.service';
import { TrainsCacheService } from './trains-cache.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_HOST!,
            port: Number(process.env.REDIS_PORT!),
          },
          ttl: 60 * 1000,
        }),
      }),
    }),
  ],
  providers: [StationsCacheService, TrainsCacheService],
  exports: [CacheModule, StationsCacheService, TrainsCacheService],
})
export class AppCacheModule {}
