import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Train } from '../../trains/entities/train.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('favorites')
@Unique(['userId', 'trainId'])
export class Favorite {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  trainId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Train, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trainId' })
  train: Train;
}
