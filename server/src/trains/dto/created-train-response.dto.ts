import { OmitType, PickType } from '@nestjs/swagger';
import { Train } from '../entities/train.entity';
import { Station } from '../../stations/entities/station.entity';
import { RoutePoint } from '../entities/route-point.entity';

export class StationMinimalDto extends PickType(Station, ['id'] as const) {}

export class RoutePointMinimalDto extends OmitType(RoutePoint, [
  'station',
  'train',
] as const) {
  station: StationMinimalDto;
}

export class CreatedTrainResponseDto extends OmitType(Train, [
  'routeItems',
  'isFavorite',
] as const) {
  routeItems: RoutePointMinimalDto[];
}
