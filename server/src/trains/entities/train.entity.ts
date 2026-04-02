import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoutePoint } from '../../route-points/entities/route-point.entity';
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
  @Column({ unique: true })
  trainNumber: string;

  @ApiProperty({ example: 'Kyiv - Lviv' })
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
    eager: true,
  })
  routeItems: RoutePoint[];
}
