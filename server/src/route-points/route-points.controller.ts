import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { RoutePointsService } from './route-points.service';
import { AuthGuard } from '@nestjs/passport';
import { SearchTrainPaginationDto } from '../trains/dto/search-train-pagination.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Route Points')
@ApiBearerAuth()
@Controller('route-points')
export class RoutePointsController {
  constructor(private readonly routePointsService: RoutePointsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get schedule (all route points with filters)' })
  find(@Query() searchDto: SearchTrainPaginationDto) {
    return this.routePointsService.find(searchDto);
  }
}
