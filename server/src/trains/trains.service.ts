import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Train } from './entities/train.entity';
import { CreateTrainDto } from './dto/create-train.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class TrainsService {
  constructor(
    @InjectRepository(Train)
    private trainRepository: Repository<Train>,
  ) {}

  async create(createTrainDto: CreateTrainDto): Promise<Train> {
    const { routeItems, ...trainData } = createTrainDto;

    const train = this.trainRepository.create({
      ...trainData,
      routeItems: routeItems?.map((item) => ({
        ...item,
        station: { id: item.stationId },
      })),
    });

    return this.trainRepository.save(train);
  }

  async findAll(
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
        '(train.name ILIKE :search OR train.trainNumber ILIKE :search)',
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

  async remove(id: string): Promise<void> {
    const result = await this.trainRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Train with ID "${id}" not found`);
    }
  }
}
