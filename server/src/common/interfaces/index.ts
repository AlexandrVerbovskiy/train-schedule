import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
}
