import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SearchTrainPaginationDto } from 'src/trains/dto/search-train-pagination.dto';

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async clearByPattern(pattern: string): Promise<void> {
    const store = (this.cacheManager as any).store;
    if (typeof store.keys === 'function') {
      const keys: string[] = await store.keys(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => this.cacheManager.del(key)));
      }
    }
  }

  async getSchedule(searchDto: SearchTrainPaginationDto, userId?: number): Promise<any> {
    const cacheKey = `schedule:${JSON.stringify(searchDto)}:${userId || 0}`;
    return this.cacheManager.get(cacheKey);
  }

  async setSchedule(searchDto: SearchTrainPaginationDto, userId: number, value: any): Promise<void> {
    const cacheKey = `schedule:${JSON.stringify(searchDto)}:${userId}`;
    await this.cacheManager.set(cacheKey, value, 300 * 1000);
  }

  async clearSchedule(): Promise<void> {
    await this.clearByPattern('schedule:*');
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async clearAll(): Promise<void> {
    await this.cacheManager.clear();
  }
}
