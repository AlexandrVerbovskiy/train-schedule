import { OmitType } from '@nestjs/swagger';
import { Train } from '../entities/train.entity';

export class SimpleTrainDto extends OmitType(Train, ['routeItems'] as const) {}
