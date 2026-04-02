import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutePoint } from './entities/route-point.entity';
import { RoutePointsService } from './route-points.service';
import { RoutePointsController } from './route-points.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoutePoint]), AuthModule],
  controllers: [RoutePointsController],
  providers: [RoutePointsService],
  exports: [RoutePointsService],
})
export class RoutePointsModule {}
