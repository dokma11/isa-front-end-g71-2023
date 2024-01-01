import { User } from 'src/app/infrastructure/auth/model/user.model';
import { Equipment } from '../../administration/model/equipment.model';
import { Company } from './company.model';
import { RegisteredUser } from '../../users/model/registered-user.model';
import { CompanyAdmin } from '../../administration/model/company-admin.model';

export interface Appointment {
  id?: number;
  administratorId?: number;
  pickupTime: Date;
  companyId?: number;
  status: AppointmentStatus;
  type: AppointmentType;
  duration: number;
  userId?: number;
  // Ovo mi sluzi za prikaz, ne bi trebalo da smeta u izradi iako je sustinski visak
  dateString?: string;
  timeString?: string;
  administrator?: CompanyAdmin;
  companyAdminName?: string;
  companyName?: string;
  user?: User;
}

export enum AppointmentStatus {
  ON_HOLD = 0,
  IN_PROGRESS = 1,
  DONE = 2,
  CANCELED = 3,
  EXPIRED = 4
}

export enum AppointmentType {
  PREDEFINED = 0,
  EXCEPTIONAL = 1,
}
