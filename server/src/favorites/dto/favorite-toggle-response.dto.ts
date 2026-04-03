import { ApiProperty } from '@nestjs/swagger';

export class FavoriteToggleResponseDto {
  @ApiProperty({
    example: true,
    description: 'Current favorite status after toggle',
  })
  isFavorite: boolean;
}
