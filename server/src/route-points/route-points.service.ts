import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { RoutePoint } from './entities/route-point.entity';
import { SearchTrainPaginationDto } from '../trains/dto/search-train-pagination.dto';

@Injectable()
export class RoutePointsService {
  constructor(
    @InjectRepository(RoutePoint)
    private readonly routePointRepository: Repository<RoutePoint>,
  ) {}

  async find(
    searchDto: SearchTrainPaginationDto,
  ): Promise<{ data: RoutePoint[]; count: number }> {
    const { page, limit, search, type, hour, minute } = searchDto;

    const query = this.routePointRepository
      .createQueryBuilder('rp')
      .leftJoinAndSelect('rp.train', 'train')
      .leftJoinAndSelect('rp.station', 'station')
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

    query.skip((page - 1) * limit).take(limit);

    const [data, count] = await query.getManyAndCount();
    return { data, count };
  }
}
