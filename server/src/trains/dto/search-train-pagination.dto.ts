import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { TrainType } from '../entities/train.entity';

export class SearchTrainPaginationDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter by train type',
    enum: TrainType,
    required: false,
  })
  @IsOptional()
  @IsEnum(TrainType)
  type?: TrainType;

  @ApiProperty({
    example: 14,
    description: 'Filter by departure hour',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(23)
  hour?: number;

  @ApiProperty({
    example: 30,
    description: 'Filter by departure minute',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(59)
  minute?: number;
}
