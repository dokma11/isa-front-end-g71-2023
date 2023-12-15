import { CompanyAdmin } from "../../administration/model/company-admin.model";
import { RegisteredUser } from "../../users/model/registered-user.model";

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