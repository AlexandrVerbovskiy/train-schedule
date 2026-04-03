import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoutePoint } from '../../trains/entities/route-point.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('stations')
export class Station {
  @ApiProperty({ example: 'uuid-123' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Kyiv' })
  @Column({ unique: true })
  name: string;

  @ApiProperty({ type: () => [RoutePoint] })
  @OneToMany(() => RoutePoint, (routeItem) => routeItem.station)
  routeItems: RoutePoint[];
}
