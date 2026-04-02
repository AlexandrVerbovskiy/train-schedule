import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { StationsCacheService } from '../common/cache/stations-cache.service';
import { ScheduleCacheService } from '../common/cache/schedule-cache.service';
import { TrainsCacheService } from '../common/cache/trains-cache.service';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
    private readonly scheduleCacheService: ScheduleCacheService,
    private readonly cacheService: StationsCacheService,
    private readonly trainsCacheService: TrainsCacheService,
  ) {}

  async clearRelatedCache(): Promise<void> {
    await Promise.all([
      this.scheduleCacheService.clearAll(),
      this.trainsCacheService.clearAll(),
      this.cacheService.clearAll(),
    ]);
  }

  private async validateNameUniqueness(
    name: string,
    excludeId?: string,
  ): Promise<void> {
    const existing = await this.existsByName(name, excludeId);
    if (existing) {
      throw new ConflictException(`Station "${name}" already exists`);
    }
  }

  async create(createStationDto: CreateStationDto): Promise<Station> {
    await this.validateNameUniqueness(createStationDto.name);

    const station = this.stationRepository.create(createStationDto);
    const saved = await this.stationRepository.save(station);
    await this.clearRelatedCache();
    return saved;
  }

  async findAll(): Promise<Station[]> {
    const cacheKey = 'all';
    const cached = await this.cacheService.get<Station[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const items = await this.stationRepository.find({
      order: { name: 'ASC' },
    });

    await this.cacheService.set(cacheKey, items);
    return items;
  }

  async find(
    paginationDto: PaginationDto,
  ): Promise<{ data: Station[]; count: number }> {
    const cacheKey = JSON.stringify(paginationDto);
    const cached = await this.cacheService.get<{
      data: Station[];
      count: number;
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    const { page = 1, limit = 10 } = paginationDto;

    const [data, count] = await this.stationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    const result = { data, count };
    await this.cacheService.set(cacheKey, result);
    return result;
  }

  async update(
    id: string,
    updateStationDto: UpdateStationDto,
  ): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }

    if (updateStationDto.name && updateStationDto.name !== station.name) {
      await this.validateNameUniqueness(updateStationDto.name, id);
    }

    Object.assign(station, updateStationDto);
    const updated = await this.stationRepository.save(station);
    await this.clearRelatedCache();
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.stationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    await this.clearRelatedCache();
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const qb = this.stationRepository
      .createQueryBuilder('station')
      .where('LOWER(station.name) = LOWER(:name)', { name });

    if (excludeId) {
      qb.andWhere('station.id != :excludeId', { excludeId });
    }

    const count = await qb.getCount();
    return count > 0;
  }
}
