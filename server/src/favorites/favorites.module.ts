import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Train } from '../trains/entities/train.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Train])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
