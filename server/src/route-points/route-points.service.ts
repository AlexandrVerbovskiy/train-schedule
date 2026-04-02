import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { RoutePoint } from './entities/route-point.entity';
import { SearchTrainPaginationDto } from '../trains/dto/search-train-pagination.dto';
import { ScheduleCacheService } from '../common/cache/schedule-cache.service';
import { PaginatedResponse } from '../common/interfaces';
import { UserScheduleItem } from './types';

@Injectable()
export class RoutePointsService {
  constructor(
    @InjectRepository(RoutePoint)
    private readonly routePointRepository: Repository<RoutePoint>,
    private readonly scheduleCacheService: ScheduleCacheService,
  ) {}

  async find(
    searchDto: SearchTrainPaginationDto,
    userId: number,
  ): Promise<PaginatedResponse<UserScheduleItem>> {
    const cached = await this.scheduleCacheService.getUserScheduleList(
      searchDto,
      userId,
    );

    if (cached) {
      return cached;
    }

    const { page, limit, search, type, hour, minute, showOnlyFavorites } =
      searchDto;

    const query = this.routePointRepository
      .createQueryBuilder('rp')
      .leftJoinAndSelect('rp.train', 'train')
      .leftJoinAndSelect('rp.station', 'station')
      .leftJoin(
        'favorites',
        'fav',
        'fav.routePointId = rp.id AND fav.userId = :userId',
        { userId: userId || 0 },
      )
      .addSelect('fav.id', 'fav_id')
      .orderBy('rp.departureHour', 'ASC')
      .addOrderBy('rp.departureMinute', 'ASC');

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where(
            'station.name ILIKE :search OR train.name ILIKE :search OR train.trainNumber ILIKE :search',
            { search: `%${search}%` },
          );
        }),
      );
    }

    if (type) {
      query.andWhere('train.type = :type', { type });
    }

    if (hour !== undefined && hour !== null) {
      if (minute !== undefined && minute !== null) {
        query.andWhere(
          'rp.departureHour = :hour AND rp.departureMinute = :minute',
          { hour, minute },
        );
      } else {
        query.andWhere('rp.departureHour = :hour', { hour });
      }
    }

    if (showOnlyFavorites && userId) {
      query.andWhere('fav.id IS NOT NULL');
    }

    query.skip((page - 1) * limit).take(limit);

    const count = await query.getCount();
    const data = await query.getRawAndEntities();

    const mapped: UserScheduleItem[] = data.entities.map((entity, index) => ({
      ...entity,
      isFavorite: !!(data.raw[index] as { fav_id: string | null }).fav_id,
    }));

    const result = { data: mapped, count };
    await this.scheduleCacheService.setUserScheduleList(
      searchDto,
      userId,
      result,
    );
    return result;
  }
}
