import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  constructor() {}

  async onModuleInit() {}

  getHello(): string {
    return 'Hello World!';
  }
}
