export interface RegisteredUser {
  id?: number;
  name: string;
  surname: string;
  password?: string; // so that the password does not have to be updated
  email: string;
  companyInformation: string;
  telephoneNumber: string;
  city: string;
  state: string;
  role: string;
  profession: string;
  points: number;
}
