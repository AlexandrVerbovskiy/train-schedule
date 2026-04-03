import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { RoutePoint } from './route-point.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TrainType {
  PASSENGER = 'passenger',
  EXPRESS = 'express',
  INTERCITY = 'intercity',
}

@Entity('trains')
export class Train {
  @ApiProperty({ example: 'uuid-123' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '042K' })
  @Index()
  @Column({ unique: true })
  trainNumber: string;

  @ApiProperty({ example: 'Kyiv - Lviv' })
  @Index()
  @Column()
  name: string;

  @ApiProperty({ enum: TrainType, example: TrainType.PASSENGER })
  @Column({
    type: 'enum',
    enum: TrainType,
    default: TrainType.PASSENGER,
  })
  type: TrainType;

  @ApiProperty({ type: () => [RoutePoint] })
  @OneToMany(() => RoutePoint, (routeItem) => routeItem.train, {
    cascade: true,
  })
  routeItems: RoutePoint[];

  @ApiProperty({
    description: 'Whether the current user has favorited this train',
    required: false,
    example: true,
  })
  isFavorite?: boolean;
}
