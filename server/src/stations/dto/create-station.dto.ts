import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStationDto {
  @ApiProperty({ example: 'Kyiv Central', description: 'Name of the station' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}
