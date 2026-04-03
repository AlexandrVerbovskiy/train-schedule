import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BaseCacheService } from './base-cache.service';
import { SearchSchedulePaginationDto } from 'src/trains/dto/search-schedule-pagination.dto';
import { ScheduleListResponseDto } from 'src/trains/dto/schedule-list-response.dto';

@Injectable()
export class TrainsCacheService extends BaseCacheService {
  constructor(@Inject(CACHE_MANAGER) cacheManager: Cache) {
    super(cacheManager, 'trains');
  }

  private generateBaseKey(userId: number): string {
    return `schedule-${userId}`;
  }

  private generateUserScheduleListKey(
    searchDto: SearchSchedulePaginationDto,
    userId: number,
  ): string {
    return `${this.generateBaseKey(userId)}:${JSON.stringify(searchDto)}`;
  }

  async getUserScheduleList(
    searchDto: SearchSchedulePaginationDto,
    userId: number,
  ): Promise<ScheduleListResponseDto | undefined> {
    return this.get(this.generateUserScheduleListKey(searchDto, userId));
  }

  async setUserScheduleList(
    searchDto: SearchSchedulePaginationDto,
    userId: number,
    value: ScheduleListResponseDto,
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
