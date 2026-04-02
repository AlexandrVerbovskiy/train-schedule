import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RoutePoint } from '../../route-points/entities/route-point.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('favorites')
@Unique(['userId', 'routePointId'])
export class Favorite {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  routePointId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => RoutePoint, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routePointId' })
  routePoint: RoutePoint;
}
