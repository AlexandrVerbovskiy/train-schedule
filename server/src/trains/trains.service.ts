import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, Brackets, SelectQueryBuilder } from 'typeorm';
import { Train } from './entities/train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RoutePoint } from './entities/route-point.entity';
import { TrainsCacheService } from '../cache/trains-cache.service';
import { EventsGateway } from '../events/events.gateway';
import { SearchSchedulePaginationDto } from './dto/search-schedule-pagination.dto';
import { TrainsListResponseDto } from './dto/trains-list-response.dto';
import { CreatedTrainResponseDto } from './dto/created-train-response.dto';
import { ScheduleListResponseDto } from './dto/schedule-list-response.dto';

@Injectable()
export class TrainsService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
    @InjectRepository(RoutePoint)
    private routePointRepository: Repository<RoutePoint>,
    private readonly trainsCacheService: TrainsCacheService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async clearRelatedCache(): Promise<void> {
    await Promise.all([this.trainsCacheService.clearAll()]);
    this.eventsGateway.emitDataUpdate('TRAINS_UPDATED');
  }

  async create(
    createTrainDto: CreateTrainDto,
  ): Promise<CreatedTrainResponseDto> {
    const { routeItems, ...trainData } = createTrainDto;

    await this.checkTrainNumberUniqueness(trainData.trainNumber);

    const trainPartial: DeepPartial<Train> = {
      ...trainData,
      routeItems: routeItems?.map((item) => ({
        ...item,
        station: { id: item.stationId },
      })),
    };

    const train = this.trainRepository.create(trainPartial);
    const saved = await this.trainRepository.save(train);
    await this.clearRelatedCache();
    return saved;
  }

  async find(paginationDto: PaginationDto): Promise<TrainsListResponseDto> {
    const cacheKey = JSON.stringify(paginationDto);
    const cached =
      await this.trainsCacheService.get<TrainsListResponseDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page, limit, search } = paginationDto;

    const query = this.trainRepository
      .createQueryBuilder('train')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('train.trainNumber', 'ASC');

    if (search) {
      query.andWhere(
        'train.name ILIKE :search OR train.trainNumber ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [data, count] = await query.getManyAndCount();
    const result = { data, count };
    await this.trainsCacheService.set(cacheKey, result);
    return result;
  }

  async update(
    id: string,
    updateTrainDto: UpdateTrainDto,
  ): Promise<CreatedTrainResponseDto> {
    const train = await this.trainRepository.findOne({
      where: { id },
      relations: ['routeItems', 'routeItems.station'],
    });

    if (!train) {
      throw new NotFoundException(`Train with ID "${id}" not found`);
    }

    const { routeItems, ...trainData } = updateTrainDto;
    await this.checkTrainNumberUniqueness(trainData.trainNumber!, id);

    if (routeItems) {
      await this.routePointRepository.delete({ train: { id } });
      const trainId = id;

      const newRouteItems: DeepPartial<RoutePoint>[] = routeItems.map(
        (item) => ({
          ...item,
          station: { id: item.stationId },
          train: { id: trainId },
        }),
      );

      train.routeItems = this.routePointRepository.create(newRouteItems);
    }

    Object.assign(train, trainData);
    const updated = await this.trainRepository.save(train);
    await this.clearRelatedCache();
    return updated;
  }

  private async checkTrainNumberUniqueness(
    trainNumber: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.trainRepository.findOne({
      where: { trainNumber },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        `Train with number "${trainNumber}" already exists`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.trainRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Train with ID "${id}" not found`);
    }
    await this.clearRelatedCache();
  }

  async schedule(
    searchDto: SearchSchedulePaginationDto,
    userId: number,
  ): Promise<ScheduleListResponseDto> {
    const cached = await this.trainsCacheService.getUserScheduleList(
      searchDto,
      userId,
    );

    if (cached) {
      return cached;
    }

    const { page, limit, search, type, hour, minute, showOnlyFavorites } =
      searchDto;

    const query = this.trainRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.routeItems', 'routeItems')
      .leftJoinAndSelect('routeItems.station', 'station')
      .leftJoin(
        'favorites',
        'fav',
        'fav.trainId = train.id AND fav.userId = :userId',
      )
      .addSelect('fav.id', 'fav_id')
      .orderBy('train.trainNumber', 'ASC')
      .andWhere((subQuery: SelectQueryBuilder<Train>) => {
        const countSub = subQuery
          .subQuery()
          .select('COUNT(rp_count.id)')
          .from(RoutePoint, 'rp_count')
          .where('rp_count.train = train.id');
        return `${countSub.getQuery()} >= 2`;
      });

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('train.name ILIKE :search')
            .orWhere('train.trainNumber ILIKE :search')
            .orWhere('CAST(train.type AS text) ILIKE :search')
            .orWhere((subQuery: SelectQueryBuilder<Train>) => {
              const stationNameSub = subQuery
                .subQuery()
                .select('1')
                .from(RoutePoint, 'rp_sub_name')
                .leftJoin('rp_sub_name.station', 'st_sub_name')
                .where('rp_sub_name.train = train.id')
                .andWhere('st_sub_name.name ILIKE :search');

              return `EXISTS (${stationNameSub.getQuery()})`;
            });
        }),
      );
    }

    if (type) {
      query.andWhere('train.type = :type', { type });
    }

    if (showOnlyFavorites && userId) {
      query.andWhere('fav.id IS NOT NULL');
    }

    if (hour !== undefined && hour !== null) {
      query.andWhere((subQuery: SelectQueryBuilder<Train>) => {
        const timeSub = subQuery
          .subQuery()
          .select('1')
          .from(RoutePoint, 'rp_sub_time')
          .where('rp_sub_time.train = train.id')
          .andWhere(
            new Brackets((qb) => {
              qb.where(
                new Brackets((qb) => {
                  qb.where('rp_sub_time.departureHour = :hour');
                  if (minute !== undefined && minute !== null) {
                    qb.andWhere('rp_sub_time.departureMinute = :minute');
                  }
                }),
              ).orWhere(
                new Brackets((qb) => {
                  qb.where('rp_sub_time.arrivalHour = :hour');
                  if (minute !== undefined && minute !== null) {
                    qb.andWhere('rp_sub_time.arrivalMinute = :minute');
                  }
                }),
              );
            }),
          );

        return `EXISTS (${timeSub.getQuery()})`;
      });
    }

    query.setParameters({
      search: `%${search}%`,
      type,
      hour,
      minute,
      userId: userId || 0,
    });

    const count = await query.getCount();
    const { entities: trains, raw } = (await query
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities()) as {
      entities: Train[];
      raw: { train_id: string; fav_id: string | null }[];
    };

    trains.forEach((train) => {
      if (train.routeItems) {
        train.routeItems.sort((a, b) => (a.order || 0) - (b.order || 0));
      }

      const hasFavorite = raw.some(
        (r) => r.train_id === train.id && r.fav_id !== null,
      );
      train.isFavorite = hasFavorite;
    });

    const result = { data: trains, count };
    await this.trainsCacheService.setUserScheduleList(
      searchDto,
      userId,
      result,
    );
    return result;
  }
}
