import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Equipment } from '../../administration/model/equipment.model';
import { Company } from './company.model';
import { RegisteredUser } from '../../users/model/registered-user.model';

export interface Appointment {
  id?: number;
  pickupTime: Date;
  duration: number;
  status: Status;
  type: Type;
  companyId: number;
  userId?: number;
  administratorId?: number;
  companyAdminName?: string;
}

export enum Status {
  ON_HOLD = 0,
  IN_PROGRESS = 1,
  DONE = 2,
  CANCELED = 3,
}

export enum Type {
  PREDEFINED = 0,
  EXCEPTIONAL = 1,
}
