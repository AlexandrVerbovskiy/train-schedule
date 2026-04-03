import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { SeedService } from './seed.service';
import { UserSeeder } from './seeders/user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeedService, UserSeeder],
})
export class DatabaseModule {}
