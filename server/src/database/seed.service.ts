import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSeeder } from './seeders/user.seeder';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly userSeeder: UserSeeder) {}

  async onModuleInit() {
    await this.userSeeder.seed();
  }
}
