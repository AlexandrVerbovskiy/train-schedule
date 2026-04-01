import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('✅ DATABASE CONNECTED SUCCESSFULLY!');
    } catch (e) {
      console.error('❌ DATABASE CONNECTION FAILED:', e.message);
    }

    console.log('BACKEND PORT:', process.env.PORT);

    try {
      const redis = new Redis({
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      });
      const res = await redis.ping();
      console.log(
        '✅ REDIS CONNECTED SUCCESSFULLY! (PING RESPONSE: ' + res + ')',
      );
      await redis.quit();
    } catch (e) {
      console.error('❌ REDIS CONNECTION FAILED:', e.message);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
