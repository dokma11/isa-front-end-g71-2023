import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Equipment } from './model/equipment.model';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { CompanyAdmin } from './model/company-admin.model';
import { EquipmentQuantity } from '../companies/model/equipmentQuantity.model';
import { Message } from './model/message.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  url: string = environment.apiHost + "socket";
  restUrl: string = environment.apiHost + "sendMessageRest";

  constructor(private http: HttpClient) { }

  getEquipment(): Observable<PagedResults<Equipment>> {
    return this.http.get<PagedResults<Equipment>>(environment.apiHost + 'equipment')
  }

  deleteEquipment(id: number): Observable<Equipment> {
    return this.http.delete<Equipment>(environment.apiHost + 'equipment/' + id);
  }

  addEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(environment.apiHost + 'equipment', equipment);
  }

  updateEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(environment.apiHost + 'equipment/' + equipment.id, equipment);
  }

  getCompanyAdministratorByid(id: number): Observable<CompanyAdmin> {
    return this.http.get<CompanyAdmin>(environment.apiHost + 'companyAdministrator/' + id);
  }

  updateCompanyAdministrator(companyAdmin: CompanyAdmin): Observable<CompanyAdmin> {
    return this.http.put<CompanyAdmin>(environment.apiHost + 'companyAdministrator/' + companyAdmin.id, companyAdmin);
  }

  getEquipmentQuantities(id: number): Observable<EquipmentQuantity>{
    return this.http.get<EquipmentQuantity>(environment.apiHost + 'equipmentQuantity/equipment/' + id);
  }

  getBookedQuantities(id: number): Observable<number>{
    return this.http.get<number>(environment.apiHost + 'equipmentQuantity/quantity/' + id);
  }

  getVehicleLocationCoordinates(): Observable<string> {
    return this.http.get(environment.apiHost + 'vehicles/', { responseType: 'text' });
  }

  startSimulator(): Observable<string> {
    return this.http.get(environment.apiHost + 'vehicles/startSending', { responseType: 'text' });
  }
  
  post(data: Message) {
    return this.http.post<Message>(this.url, data)
      .pipe(map((data: Message) => { return data; }));
  }
}
