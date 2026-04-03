import { ApiProperty } from '@nestjs/swagger';
import { SimpleTrainDto } from './simple-train.dto';
import { BasePaginationResponseDto } from '../../common/dto/base-pagination-response.dto';
import { PaginatedResponse } from '../../common/interfaces';

export class TrainsListResponseDto
  extends BasePaginationResponseDto
  implements PaginatedResponse<SimpleTrainDto>
{
  @ApiProperty({ type: [SimpleTrainDto] })
  data: SimpleTrainDto[];
}
