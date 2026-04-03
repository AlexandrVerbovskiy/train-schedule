import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './entities/station.entity';
import { StationsService } from './stations.service';
import { StationsController } from './stations.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Station]), AuthModule],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
