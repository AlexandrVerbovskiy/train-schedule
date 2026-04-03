import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { StationsService } from './stations.service';
import { Station } from './entities/station.entity';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { StationsListResponseDto } from './dto/stations-list-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Query } from '@nestjs/common';

@ApiTags('Stations')
@ApiBearerAuth()
@Controller('stations')
export class StationsController {
  constructor(private readonly stationsService: StationsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Create station',
    description: 'Allows an administrator to create a new railway station',
  })
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 409, description: 'Station already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createStationDto: CreateStationDto): Promise<Station> {
    return this.stationsService.create(createStationDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get stations (paginated)',
    description: 'Returns a paginated list of stations with search support',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: StationsListResponseDto,
  })
  find(
    @Query() paginationDto: PaginationDto,
  ): Promise<StationsListResponseDto> {
    return this.stationsService.find(paginationDto);
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all stations',
    description: 'Returns a full list of all stations without pagination',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return this.stationsService.findAll();
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Update station',
    description: 'Allows an administrator to update station details',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateStationDto: UpdateStationDto,
  ): Promise<Station> {
    return this.stationsService.update(id, updateStationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Delete station',
    description: 'Allows an administrator to permanently delete a station',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Station not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string): Promise<void> {
    return this.stationsService.remove(id);
  }
}
