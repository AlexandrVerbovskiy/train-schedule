import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoutePoint } from './entities/route-point.entity';
import { CreateRoutePointDto } from './dto/create-route-point.dto';
import { Train } from '../trains/entities/train.entity';
import { Station } from '../stations/entities/station.entity';

@Injectable()
export class RoutePointsService {
  constructor(
    @InjectRepository(RoutePoint)
    private readonly routePointRepository: Repository<RoutePoint>,
    @InjectRepository(Train)
    private readonly trainRepository: Repository<Train>,
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
  ) {}

  async create(createRoutePointDto: CreateRoutePointDto): Promise<RoutePoint> {
    const { trainId, stationId, ...rest } = createRoutePointDto;

    const train = await this.trainRepository.findOneBy({ id: trainId });
    if (!train)
      throw new NotFoundException(`Train with ID ${trainId} not found`);

    const station = await this.stationRepository.findOneBy({ id: stationId });
    if (!station)
      throw new NotFoundException(`Station with ID ${stationId} not found`);

    const routePoint = this.routePointRepository.create({
      ...rest,
      train,
      station,
    });

    return this.routePointRepository.save(routePoint);
  }

  async findAll(): Promise<RoutePoint[]> {
    return this.routePointRepository.find({ relations: ['train', 'station'] });
  }

  async remove(id: string): Promise<void> {
    const result = await this.routePointRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Route point with ID ${id} not found`);
    }
  }
}
