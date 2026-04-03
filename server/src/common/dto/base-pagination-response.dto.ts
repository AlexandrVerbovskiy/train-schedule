import { ApiProperty } from '@nestjs/swagger';

export class BasePaginationResponseDto {
  @ApiProperty({ example: 10, description: 'Total number of items' })
  count: number;
}
