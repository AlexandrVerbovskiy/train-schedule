import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BaseCacheService } from './base-cache.service';
import { SearchTrainPaginationDto } from 'src/trains/dto/search-train-pagination.dto';
import { PaginatedResponse } from '../interfaces';
import { UserScheduleItem } from '../../route-points/types';

@Injectable()
export class ScheduleCacheService extends BaseCacheService {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(cacheManager, 'schedule');
  }

  private generateUserScheduleListKey(
    searchDto: SearchTrainPaginationDto,
    userId: number,
  ): string {
    return `${userId}:${JSON.stringify(searchDto)}`;
  }

  async getUserScheduleList(
    searchDto: SearchTrainPaginationDto,
    userId: number,
  ): Promise<PaginatedResponse<UserScheduleItem> | undefined> {
    return this.get(this.generateUserScheduleListKey(searchDto, userId));
  }

  async setUserScheduleList(
    searchDto: SearchTrainPaginationDto,
    userId: number,
    value: any,
  ): Promise<void> {
    await this.set(
      this.generateUserScheduleListKey(searchDto, userId),
      value,
      300 * 1000,
    );
  }

  async clearUserScheduleList(userId: number): Promise<void> {
    await this.clearAll(`${userId}:*`);
  }
}
