import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisteredUser } from './model/registered-user.model';
import { environment } from 'src/env/environment';

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

  getOne() : Observable<RegisteredUser>{
    return this.http.get<RegisteredUser>(
        environment.apiHost + 'registeredUsers/' + 1
    )
  }

  update(user: RegisteredUser): Observable<RegisteredUser>{
    return this.http.put<RegisteredUser>(
      environment.apiHost + 'registeredUsers/' + user.id, user
    );
  }

}
