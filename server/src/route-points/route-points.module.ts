import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutePoint } from './entities/route-point.entity';
import { RoutePointsService } from './route-points.service';
import { RoutePointsController } from './route-points.controller';
import { Train } from '../trains/entities/train.entity';
import { Station } from '../stations/entities/station.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoutePoint, Train, Station]), AuthModule],
  controllers: [RoutePointsController],
  providers: [RoutePointsService],
  exports: [RoutePointsService],
})
export class RoutePointsModule {}
