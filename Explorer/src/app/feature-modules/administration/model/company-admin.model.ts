import { Company } from "../../companies/model/company.model";

export interface CompanyAdmin {
  id?: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  companyInformation: string;
  telephoneNumber: string;
  city: string;
  state: string;
  role: UserRole;
  profession: string;
  company?: Company;
}

export enum UserRole {
  REGISTERED_USER = 0, 
  COMPANY_ADMINISTRATOR = 1, 
  SYSTEM_ADMINISTRATOR =2
}
