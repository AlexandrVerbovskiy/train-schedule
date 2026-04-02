import { RoutePoint } from './entities/route-point.entity';

export interface UserScheduleItem extends RoutePoint {
  isFavorite: boolean;
}
