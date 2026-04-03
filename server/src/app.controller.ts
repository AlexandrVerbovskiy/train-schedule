import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Root Welcome',
    description: 'Returns a basic welcome message and status of the API',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  getHello(): string {
    return this.appService.getHello();
  }
}
