import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export abstract class BaseCacheService {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    protected readonly prefix: string,
  ) {}

  protected getFullKey(key?: string): string {
    return key ? `${this.prefix}:${key}` : `${this.prefix}:*`;
  }

  private getTrackingKey(pattern: string): string {
    return `tracker:${this.prefix}:${pattern.replace(':*', '')}`;
  }

  async clearAll(pattern: string = '*'): Promise<void> {
    try {
      const trackingKey = this.getTrackingKey(pattern);
      const keys: string[] = (await this.cacheManager.get(trackingKey)) || [];

      if (keys && keys.length > 0) {
        await Promise.all([
          ...keys.map((key) => this.cacheManager.del(key)),
          this.cacheManager.del(trackingKey),
        ]);
        this.logger.log(`Purged ${keys.length} tracked keys for pattern: ${pattern}`);
      }
    } catch (error) {
      this.logger.error(`Failed to clear tracked cache for pattern ${pattern}:`, error);
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheManager.get<T>(this.getFullKey(key));
    } catch (e) {
      return undefined;
    }
  }

  async set(key: string, value: any, ttl: number = 300000): Promise<void> {
    try {
      const fullKey = this.getFullKey(key);
      await this.cacheManager.set(fullKey, value, ttl);

      const group = key.split(':')[0] || 'all';
      const trackingKey = this.getTrackingKey(`${group}:*`);
      const globalKey = this.getTrackingKey('*');

      await this.addToTracker(trackingKey, fullKey);
      
      if (trackingKey !== globalKey) {
        await this.addToTracker(globalKey, fullKey);
      }
    } catch (e) {
      this.logger.error(`Failed to set cache for key ${key}`, e);
    }
  }

  private async addToTracker(trackingKey: string, keyToTrack: string): Promise<void> {
    try {
      let trackedKeys: string[] = (await this.cacheManager.get(trackingKey)) || [];
      if (!Array.isArray(trackedKeys)) trackedKeys = [];
      
      if (!trackedKeys.includes(keyToTrack)) {
        trackedKeys.push(keyToTrack);
        await this.cacheManager.set(trackingKey, trackedKeys, 3600 * 1000);
      }
    } catch (e) {
      this.logger.error(`Failed to track key ${keyToTrack} in ${trackingKey}`, e);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cacheManager.del(this.getFullKey(key));
    } catch (e) {
      this.logger.error(`Failed to delete cache for key ${key}`, e);
    }
  }
}
