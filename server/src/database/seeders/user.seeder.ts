import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    try {
      const count = await this.userRepository.count();
      if (count > 0) return;

      console.log('Seed: Users...');

      const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
      await this.userRepository.save(
        this.userRepository.create({
          email: process.env.ADMIN_EMAIL!,
          password: adminPassword,
          role: UserRole.ADMIN,
        }),
      );

      const userPassword = await bcrypt.hash(
        process.env.DEFAULT_USER_PASSWORD!,
        10,
      );
      await this.userRepository.save(
        this.userRepository.create({
          email: process.env.DEFAULT_USER_EMAIL!,
          password: userPassword,
          role: UserRole.USER,
        }),
      );

      console.log('✅ Seed: Users completed successfully!');
    } catch (e) {
      console.error(`❌ Seed: Users failed: ${(e as Error)?.message}`);
    }
  }
}
