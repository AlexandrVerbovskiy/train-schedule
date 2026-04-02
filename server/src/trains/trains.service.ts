import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Train } from './entities/train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RoutePoint } from '../route-points/entities/route-point.entity';
import { TrainsCacheService } from '../cache/trains-cache.service';
import { ScheduleCacheService } from '../cache/schedule-cache.service';
import { PaginatedResponse } from '../common/interfaces';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class TrainsService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
    @InjectRepository(RoutePoint)
    private routePointRepository: Repository<RoutePoint>,
    private readonly scheduleCacheService: ScheduleCacheService,
    private readonly trainsCacheService: TrainsCacheService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async clearRelatedCache(): Promise<void> {
    await Promise.all([
      this.scheduleCacheService.clearAll(),
      this.trainsCacheService.clearAll(),
    ]);
    this.eventsGateway.emitDataUpdate('TRAINS_UPDATED');
  }

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
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

  async find(paginationDto: PaginationDto): Promise<PaginatedResponse<Train>> {
    const cacheKey = JSON.stringify(paginationDto);
    const cached =
      await this.trainsCacheService.get<PaginatedResponse<Train>>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page, limit, search } = paginationDto;

    const query = this.trainRepository
      .createQueryBuilder('train')
      .leftJoinAndSelect('train.routeItems', 'routeItems')
      .leftJoinAndSelect('routeItems.station', 'station')
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

  async update(id: string, updateTrainDto: UpdateTrainDto): Promise<Train> {
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
}
