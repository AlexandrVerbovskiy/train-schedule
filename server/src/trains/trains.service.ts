import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from './entities/train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { RoutePoint } from '../route-points/entities/route-point.entity';

@Injectable()
export class TrainsService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
    @InjectRepository(RoutePoint)
    private routePointRepository: Repository<RoutePoint>,
  ) {}

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
    const { routeItems, ...trainData } = createTrainDto;

    await this.checkTrainNumberUniqueness(trainData.trainNumber);

    const train = this.trainRepository.create({
      ...trainData,
      routeItems: routeItems?.map((item) => ({
        ...item,
        station: { id: item.stationId },
      })),
    });

    return this.trainRepository.save(train);
  }

  async find(
    paginationDto: PaginationDto,
  ): Promise<{ data: Train[]; count: number }> {
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
    return { data, count };
  }

  async findOne(id: string): Promise<Train> {
    const train = await this.trainRepository.findOne({
      where: { id },
      relations: ['routeItems', 'routeItems.station'],
    });

    if (!train) {
      throw new NotFoundException(`Train with ID "${id}" not found`);
    }

    return train;
  }

  async update(id: string, updateTrainDto: UpdateTrainDto): Promise<Train> {
    const train = await this.findOne(id);
    const { routeItems, ...trainData } = updateTrainDto;

    if (trainData.trainNumber) {
      await this.checkTrainNumberUniqueness(trainData.trainNumber, id);
    }

    if (routeItems) {
      await this.routePointRepository.delete({ train: { id } });
      
      train.routeItems = routeItems.map((item) => ({
        ...item,
        station: { id: item.stationId },
      } as any));
    }

    Object.assign(train, trainData);
    return this.trainRepository.save(train);
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
  }
}
