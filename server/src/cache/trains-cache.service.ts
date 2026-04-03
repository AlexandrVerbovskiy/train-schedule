import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BaseCacheService } from './base-cache.service';
import { SearchTrainPaginationDto } from 'src/trains/dto/search-train-pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces';
import { Train } from 'src/trains/entities/train.entity';

@Injectable()
export class TrainsCacheService extends BaseCacheService {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(cacheManager, 'trains');
  }

  private generateBaseKey(userId: number): string {
    return `schedule-${userId}`;
  }

  private generateUserScheduleListKey(
    searchDto: SearchTrainPaginationDto,
    userId: number,
  ): string {
    return `${this.generateBaseKey(userId)}:${JSON.stringify(searchDto)}`;
  }

  async getUserScheduleList(
    searchDto: SearchTrainPaginationDto,
    userId: number,
  ): Promise<PaginatedResponse<Train> | undefined> {
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
    await this.clearAll(`${this.generateBaseKey(userId)}:*`);
  }
}
