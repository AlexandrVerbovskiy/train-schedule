import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TrainType } from '../entities/train.entity';

@ValidatorConstraint({ name: 'isUniqueStations', async: false })
class IsUniqueStationsConstraint implements ValidatorConstraintInterface {
  validate(routeItems: NestedRoutePointDto[]) {
    if (!Array.isArray(routeItems)) {
      return true;
    }

    const stationIds = routeItems.map((item) => item.stationId);
    return new Set(stationIds).size === stationIds.length;
  }

  defaultMessage() {
    return 'A train route cannot contain duplicate stations';
  }
}

class NestedRoutePointDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Station ID',
  })
  @IsUUID()
  stationId: string;

  @ApiProperty({
    example: 14,
    description: 'Arrival hour (0-23)',
    required: false,
  })
  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  arrivalHour?: number;

  @ApiProperty({
    example: 30,
    description: 'Arrival minute (0-59)',
    required: false,
  })
  @IsInt()
  @Min(0)
  @Max(59)
  @IsOptional()
  arrivalMinute?: number;

  @ApiProperty({
    example: 15,
    description: 'Departure hour (0-23)',
    required: false,
  })
  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  departureHour?: number;

  @ApiProperty({
    example: 0,
    description: 'Departure minute (0-59)',
    required: false,
  })
  @IsInt()
  @Min(0)
  @Max(59)
  @IsOptional()
  departureMinute?: number;

  @ApiProperty({ example: 1, description: 'Stop order number' })
  @IsInt()
  @Min(1)
  order: number;
}

export class CreateTrainDto {
  @ApiProperty({ example: '042K', description: 'Unique train number' })
  @IsString()
  @IsNotEmpty()
  trainNumber: string;

  @ApiProperty({ example: 'Kyiv - Lviv', description: 'Train trip name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    enum: TrainType,
    example: TrainType.PASSENGER,
    required: false,
  })
  @IsEnum(TrainType)
  @IsOptional()
  type?: TrainType;

  @ApiProperty({
    type: [NestedRoutePointDto],
    description: 'Route stops',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(2, { message: 'A train route must have at least 2 stops' })
  @Validate(IsUniqueStationsConstraint)
  @ValidateNested({ each: true })
  @Type(() => NestedRoutePointDto)
  routeItems?: NestedRoutePointDto[];
}
