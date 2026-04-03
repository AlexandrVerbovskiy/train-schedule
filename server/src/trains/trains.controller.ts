import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { TrainsService } from './trains.service';
import { CreateTrainDto } from './dto/create-train.dto';
import { UpdateTrainDto } from './dto/update-train.dto';
import { CreatedTrainResponseDto } from './dto/created-train-response.dto';
import { TrainsListResponseDto } from './dto/trains-list-response.dto';
import { ScheduleListResponseDto } from './dto/schedule-list-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { SearchSchedulePaginationDto } from './dto/search-schedule-pagination.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Trains')
@ApiBearerAuth()
@Controller('trains')
export class TrainsController {
  constructor(private readonly trainsService: TrainsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Create new train',
    description:
      'Allows an administrator to create a new train with its associated route. Requires a unique train number and at least two route points',
  })
  @ApiResponse({
    status: 201,
    description: 'The train has been successfully created',
    type: CreatedTrainResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({
    status: 409,
    description: 'A train with this number already exists',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createTrainDto: CreateTrainDto,
  ): Promise<CreatedTrainResponseDto> {
    return this.trainsService.create(createTrainDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get all trains',
    description:
      'Returns a paginated list of all trains. Supports global search by train name or number',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: TrainsListResponseDto,
  })
  find(@Query() searchDto: PaginationDto): Promise<TrainsListResponseDto> {
    return this.trainsService.find(searchDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Update train details',
    description:
      'Allows an administrator to update train details and its route points. If route items are provided, the entire route is replaced',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreatedTrainResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Train not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id') id: string,
    @Body() updateTrainDto: UpdateTrainDto,
  ): Promise<CreatedTrainResponseDto> {
    return this.trainsService.update(id, updateTrainDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Delete train',
    description: 'Permanently deletes a train and its route from the system',
  })
  @ApiResponse({ status: 200, description: 'Train successfully deleted' })
  @ApiResponse({ status: 404, description: 'Train not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id') id: string): Promise<void> {
    return this.trainsService.remove(id);
  }

  @Get('schedule')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Get public schedule',
    description:
      'Returns a paginated list of trains filtered by departure/arrival times, station names, or favorites. Includes favorite status for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ScheduleListResponseDto,
  })
  schedule(
    @Query() searchDto: SearchSchedulePaginationDto,
    @Req() req: RequestWithUser,
  ): Promise<ScheduleListResponseDto> {
    return this.trainsService.schedule(searchDto, req.user.id);
  }
}
