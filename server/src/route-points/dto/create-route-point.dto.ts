import { IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoutePointDto {
  @ApiProperty({ example: 'uuid-123', description: 'Train ID' })
  @IsUUID()
  trainId: string;

  @ApiProperty({ example: 'uuid-456', description: 'Station ID' })
  @IsUUID()
  stationId: string;

  @ApiProperty({
    example: 14,
    description: 'Arrival hour (0-23)',
    required: false,
    nullable: true,
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
    nullable: true,
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
    nullable: true,
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
    nullable: true,
  })
  @IsInt()
  @Min(0)
  @Max(59)
  @IsOptional()
  departureMinute?: number;

  @ApiProperty({ example: 1, description: 'Stop order' })
  @IsInt()
  @Min(1)
  order: number;
}
