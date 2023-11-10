import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/env/environment';
import { Observable } from 'rxjs';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Course } from './model/course.model';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course> {
    return this.http.get<Course>(environment.apiHost + 'courses')
  }

  deleteCourse(id: number): Observable<Course> {
    return this.http.delete<Course>(environment.apiHost + 'layout/courses/' + id);
  }

  addCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(environment.apiHost + 'courses', course);
  }

  updateCourse(course: Course): Observable<Course> {
    return this.http.put<Course>(environment.apiHost + 'layout/courses/' + course.id, course);
  }
}