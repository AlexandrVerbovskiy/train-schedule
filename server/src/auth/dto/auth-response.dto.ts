import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class UserProfileDto extends PickType(User, [
  'id',
  'email',
  'role',
] as const) {}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({ type: UserProfileDto })
  user: UserProfileDto;
}
