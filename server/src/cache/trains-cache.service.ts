import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BaseCacheService } from './base-cache.service';

@Injectable()
export class TrainsCacheService extends BaseCacheService {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(cacheManager, 'trains');
  }
}
