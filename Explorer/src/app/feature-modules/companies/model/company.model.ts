export interface Company {
  id?: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  description: string;
  averageGrade: number;
  // There is no user so i can't use this: administrators: User[];
}