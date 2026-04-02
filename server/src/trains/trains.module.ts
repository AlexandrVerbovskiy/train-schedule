import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from './entities/train.entity';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { AuthModule } from '../auth/auth.module';

import { RoutePoint } from '../route-points/entities/route-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Train, RoutePoint]), AuthModule],
  controllers: [TrainsController],
  providers: [TrainsService],
  exports: [TrainsService],
})
export class TrainsModule {}
