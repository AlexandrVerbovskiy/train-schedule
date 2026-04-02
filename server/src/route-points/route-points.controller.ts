import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoutePointsService } from './route-points.service';
import { CreateRoutePointDto } from './dto/create-route-point.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Route Points')
@ApiBearerAuth()
@Controller('route-points')
export class RoutePointsController {
  constructor(private readonly routePointsService: RoutePointsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Add a new stop to a train route' })
  create(@Body() createRoutePointDto: CreateRoutePointDto) {
    return this.routePointsService.create(createRoutePointDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all route points' })
  findAll() {
    return this.routePointsService.findAll();
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Remove a stop from a route' })
  remove(@Param('id') id: string) {
    return this.routePointsService.remove(id);
  }
}
