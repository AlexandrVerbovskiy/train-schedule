import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private readonly stationRepository: Repository<Station>,
  ) {}

  async create(createStationDto: CreateStationDto): Promise<Station> {
    const existing = await this.existsByName(createStationDto.name);
    
    if (existing) {
        throw new ConflictException(`Station "${createStationDto.name}" already exists`);
    }

    const station = this.stationRepository.create(createStationDto);
    return this.stationRepository.save(station);
  }

  async findAll(): Promise<Station[]> {
    return this.stationRepository.find({
      order: { name: 'ASC' },
    });
  }

  async find(
    paginationDto: PaginationDto,
  ): Promise<{ data: Station[]; count: number }> {
    const { page = 1, limit = 10 } = paginationDto;

    const [data, count] = await this.stationRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return { data, count };
  }

  async findOne(id: string): Promise<Station> {
    const station = await this.stationRepository.findOne({ where: { id } });
    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
    return station;
  }

  async update(id: string, updateStationDto: UpdateStationDto): Promise<Station> {
    const station = await this.findOne(id);

    if (updateStationDto.name && updateStationDto.name !== station.name) {
      const existing = await this.existsByName(updateStationDto.name, id);

      if (existing) {
        throw new ConflictException(`Station "${updateStationDto.name}" already exists`);
      }
    }

    Object.assign(station, updateStationDto);
    return await this.stationRepository.save(station);
  }

  async remove(id: string): Promise<void> {
    const result = await this.stationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Station with ID ${id} not found`);
    }
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
      const qb = this.stationRepository.createQueryBuilder('station')
          .where('LOWER(station.name) = LOWER(:name)', { name });
      
      if (excludeId) {
          qb.andWhere('station.id != :excludeId', { excludeId });
      }
      
      const count = await qb.getCount();
      return count > 0;
  }
}
