import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Train } from '../trains/entities/train.entity';
import { TrainsCacheService } from 'src/cache/trains-cache.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(Train)
    private trainsRepository: Repository<Train>,
    private readonly trainsCacheService: TrainsCacheService,
  ) {}

  async toggle(
    userId: number,
    trainId: string,
  ): Promise<{ isFavorite: boolean }> {
    const isTrainExists = await this.trainsRepository.findOne({
      where: { id: trainId },
    });
    if (!isTrainExists) {
      throw new NotFoundException(`Train with ID "${trainId}" not found`);
    }

    const existing = await this.favoritesRepository.findOne({
      where: { userId, trainId },
    });

    if (existing) {
      await this.favoritesRepository.remove(existing);
    } else {
      const fav = this.favoritesRepository.create({ userId, trainId });
      await this.favoritesRepository.save(fav);
    }

    await this.trainsCacheService.clearUserScheduleList(userId);
    return { isFavorite: !existing };
  }
}
