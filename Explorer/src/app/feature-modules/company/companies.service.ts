import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from './model/company.model';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(private http: HttpClient) { }

  searchCompanies(searchTerm: string, searchType: string): Observable<Company>{
    const params = new HttpParams().set('searchTerm', searchTerm).set('searchType', searchType);
    return this.http.get<Company>(environment.apiHost + 'companies/search', {params})
  }

  getCompanies(): Observable<Company>{
    return this.http.get<Company>(environment.apiHost + 'companies')
  }

}
