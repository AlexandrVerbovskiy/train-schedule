import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Train } from '../../trains/entities/train.entity';
import { Station } from '../../stations/entities/station.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('route_item')
export class RoutePoint {
  @ApiProperty({ example: 'uuid-456' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Train, (train) => train.routeItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'train_id' })
  train: Train;

  @ApiProperty({ type: () => Station })
  @ManyToOne(() => Station, (station) => station.routeItems, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'station_id' })
  station: Station;

  @ApiProperty({ example: 14, required: false, nullable: true })
  @Column({ name: 'arrival_hour', type: 'int', nullable: true })
  arrivalHour: number;

  @ApiProperty({ example: 30, required: false, nullable: true })
  @Column({ name: 'arrival_minute', type: 'int', nullable: true })
  arrivalMinute: number;

  @ApiProperty({ example: 15, required: false, nullable: true })
  @Column({ name: 'departure_hour', type: 'int', nullable: true })
  departureHour: number;

  @ApiProperty({ example: 0, required: false, nullable: true })
  @Column({ name: 'departure_minute', type: 'int', nullable: true })
  departureMinute: number;

  @ApiProperty({ example: 1, description: 'Order of the stop in the route' })
  @Column({ name: 'order', type: 'int', default: 1 })
  order: number;
}
