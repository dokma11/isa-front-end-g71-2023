export interface Company {
  id?: number;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  description: string;
  averageGrade: number;
  equipment?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
}