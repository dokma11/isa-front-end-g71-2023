import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Company } from './model/company.model';
import { Equipment } from '../administration/model/equipment.model';
import { Appointment } from './model/appointment.model';
import { CompanyAdmin } from '../administration/model/company-admin.model';
import { EquipmentQuantity } from './model/equipmentQuantity.model';

import { AvailableEquipmentQuantity } from './model/availableEquipmentQuantity.model';
import { RegisteredUser } from '../users/model/registered-user.model';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + 'companies');
  }

  deleteCompany(id: number): Observable<Company> {
    return this.http.delete<Company>(environment.apiHost + 'companies/' + id);
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(environment.apiHost + 'companies', company);
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(
      environment.apiHost + 'companies/' + company.id,
      company
    );
  }

  getCompaniesEquipment(company: Company): Observable<Equipment> {
    return this.http.get<Equipment>(
      environment.apiHost + 'companies/' + company.id + '/equipment'
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + 'companies/' + id);
  }

  getCompaniesAppointments(company: Company): Observable<Appointment> {
    return this.http.get<Appointment>(
      environment.apiHost + 'companies/' + company.id + '/appointment'
    );
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(
      environment.apiHost + 'appointments',
      appointment
    );
  }

  deleteAppointment(id: number): Observable<Appointment> {
    return this.http.delete<Appointment>(environment.apiHost + 'appointments/' + id);
  }

  getAdminByEmail(email: string): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(
      environment.apiHost + 'companyAdministrator/email/' + email
    );
  }

  getAdminById(id: number): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(
      environment.apiHost + 'companyAdministrator/' + id
    );
  }

  updateCompanyAdministrator(companyAdmin: CompanyAdmin): Observable<CompanyAdmin> {
    return this.http.put<CompanyAdmin>(
      environment.apiHost + 'companyAdministrator/' + companyAdmin.id,
      companyAdmin
    );
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(
      environment.apiHost + 'equipment',
      equipment
    );
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(
      environment.apiHost + 'equipment/' + equipment.id,
      equipment
    );
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'equipment/' + id);
  }

  getCompaniesAdministrators(company: Company): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(
      environment.apiHost + 'companies/' + company.id + '/administrators'
    );
  }

  getCompanysPredefinedAppointments(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(
      environment.apiHost + 'appointments/predefined/' + id
    );
  }

  getFreeTimeSlots(
    companyId: number,
    date: string,
    startTime: string,
    endTime: string
  ): Observable<any> {
    const params = {
      companyId: companyId.toString(),
      date: date,
      startTime: startTime,
      endTime: endTime,
    };

    return this.http.get<any>(
      environment.apiHost + 'appointments/freeTimeSlots',
      { params: params }
    );
  }

  addAppointmentEquipment(equipmentQuantities: EquipmentQuantity[]) {
    return this.http.post<any>(
      environment.apiHost + 'equipmentQuantity',
      equipmentQuantities
    );
  }

  findAdminIdsForAppointmentsAtPickupTime(
    companyId: number,
    pickupTime: string
  ): Observable<number[]> {
    const params = new HttpParams()
      .set('pickupTime', pickupTime)
      .set('companyId', companyId.toString());

    return this.http.get<number[]>(
      environment.apiHost + 'appointments/admins',
      { params: params }
    );
  }

  getCompaniesAdministratorIds(company: Company): Observable<number> {
    return this.http.get<number>(
      environment.apiHost + 'companies/' + company.id + '/administrator'
    );
  }

  getEquipmentQuantities(id: number): Observable<EquipmentQuantity> {
    return this.http.get<EquipmentQuantity>(
      environment.apiHost + 'equipmentQuantity/equipment/' + id
    );
  }

  getIfRemovable(id: number): Observable<EquipmentQuantity> {
    return this.http.get<EquipmentQuantity>(
      environment.apiHost + 'equipmentQuantity/removable/' + id
    );
  }
  
  schedulePredefinedAppointment(
    userId: number,
    appointmentId: number
  ): Observable<Appointment> {
    return this.http.put<Appointment>(
      environment.apiHost +
        'appointments/schedule/' +
        userId +
        '/' +
        appointmentId,
      {}
    );
  }

  getAvailableEquipmentQuantity(
    companyId: number
  ): Observable<AvailableEquipmentQuantity[]> {
    return this.http.get<AvailableEquipmentQuantity[]>(
      environment.apiHost + 'equipment/available/' + companyId
    );
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(
      environment.apiHost + 'appointments/' + appointment.id,
      appointment
    );
  }

  pickUpAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.put<Appointment>(
      environment.apiHost + 'appointments/pickUpAppointment/' + appointment.id,
      appointment
    );
  }

  getUserByid(id: number): Observable<RegisteredUser> {
    return this.http.get<RegisteredUser>(
      environment.apiHost + 'registeredUsers/' + id
    );
  }
}
