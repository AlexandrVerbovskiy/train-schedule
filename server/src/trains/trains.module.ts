import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Train } from './entities/train.entity';
import { RoutePoint } from './entities/route-point.entity';
import { TrainsService } from './trains.service';
import { TrainsController } from './trains.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Train, RoutePoint]), AuthModule],
  controllers: [TrainsController],
  providers: [TrainsService],
})
export class TrainsModule {}
