import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisteredUser } from './model/registered-user.model';
import { environment } from 'src/env/environment';
import { Appointment } from '../companies/model/appointment.model';
import { Equipment } from '../administration/model/equipment.model';

@Injectable({
  providedIn: 'root',
})
export class UsersServiceService {
  constructor(private http: HttpClient) {}

  register(user: RegisteredUser): Observable<RegisteredUser> {
    return this.http.post<RegisteredUser>(
      environment.apiHost + 'registeredUsers',
      user
    );
  }

  getOne(userId: number): Observable<RegisteredUser> {
    return this.http.get<RegisteredUser>(
      environment.apiHost + 'registeredUsers/' + userId
    );
  }

  update(user: RegisteredUser): Observable<RegisteredUser> {
    return this.http.put<RegisteredUser>(
      environment.apiHost + 'registeredUsers/' + user.id,
      user
    );
  }

  getAppointments(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      environment.apiHost + 'appointments/users/' + userId
    );
  }

  getAppointmentsEquipment(appointmentId: number): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(
      environment.apiHost + 'equipment/appointments/' + appointmentId
    );
  }

  getFutureAppointments(userId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(
      environment.apiHost + 'appointments/users/future/' + userId
    );
  }
}
