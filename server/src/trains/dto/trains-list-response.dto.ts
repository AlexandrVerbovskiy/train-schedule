import { ApiProperty } from '@nestjs/swagger';
import { Train } from '../entities/train.entity';
import { BasePaginationResponseDto } from '../../common/dto/base-pagination-response.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response';

export class TrainsListResponseDto
  extends BasePaginationResponseDto
  implements PaginatedResponse<Train>
{
  @ApiProperty({ type: [Train] })
  data: Train[];
}
