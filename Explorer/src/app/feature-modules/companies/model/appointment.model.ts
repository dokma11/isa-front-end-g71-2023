import { CompanyAdmin } from "../../administration/model/company-admin.model";
import { RegisteredUser } from "../../users/model/registered-user.model";

export interface Appointment {
  id?: number;
  administrator?: CompanyAdmin;
  pickupTime: Date;
  dateString?: string;
  timeString?: string;
  companyId?: number;
  status: AppointmentStatus;
  type: AppointmentType;
  duration: number;
  user?: RegisteredUser;
}

export enum AppointmentStatus {
  ON_HOLD = 0, 
  IN_PROGRESS = 1, 
  DONE = 2, 
  CANCELED = 3
}

export enum AppointmentType {
  PREDEFINED = 0, 
  EXCEPTIONAL = 1
}