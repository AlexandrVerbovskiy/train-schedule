import { ApiProperty } from '@nestjs/swagger';
import { Station } from '../entities/station.entity';
import { BasePaginationResponseDto } from '../../common/dto/base-pagination-response.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated-response';

export class StationsListResponseDto
  extends BasePaginationResponseDto
  implements PaginatedResponse<Station>
{
  @ApiProperty({ type: [Station] })
  data: Station[];
}
