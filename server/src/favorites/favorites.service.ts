import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { RoutePoint } from '../route-points/entities/route-point.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
    @InjectRepository(RoutePoint)
    private routePointsRepository: Repository<RoutePoint>,
  ) {}

  async toggle(userId: number, routePointId: string): Promise<{ isFavorite: boolean }> {
    const isRoutePointExists = await this.routePointsRepository.findOne({ where: { id: routePointId } });
    if (!isRoutePointExists) {
      throw new NotFoundException(`Route point with ID "${routePointId}" not found`);
    }

    const existing = await this.favoritesRepository.findOne({
      where: { userId, routePointId },
    });

    if (existing) {
      await this.favoritesRepository.remove(existing);
      return { isFavorite: false };
    }

    const fav = this.favoritesRepository.create({ userId, routePointId });
    await this.favoritesRepository.save(fav);
    return { isFavorite: true };
  }
}
