import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { Company } from './model/company.model';
import { Equipment } from '../administration/model/equipment.model';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company> {
    return this.http.get<Company>(environment.apiHost + 'companies')
  }

  deleteCompany(id: number): Observable<Company> {
    return this.http.delete<Company>(environment.apiHost + 'companies/' + id);
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(environment.apiHost + 'companies', company);
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(environment.apiHost + 'companies/' + company.id, company);
  }

  getCompaniesEquipment(company: Company): Observable<Equipment> {
    return this.http.get<Equipment>(environment.apiHost + 'companies/' + company.id + '/equipment');
  }
  
}