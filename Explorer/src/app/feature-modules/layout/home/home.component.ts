import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';
import { Course } from '../model/course.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  courses: Course[] = [];

  constructor(private service: LayoutService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses(): void {
    this.service.getCourses().subscribe({
      next: (result: Course | Course[]) => {
        if (Array.isArray(result)) {
          this.courses = result;
        } else {
          this.courses = [result];
        }
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      },
    });
  }

  courseForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  addCourse(): void {
    const course: Course = {
      name: this.courseForm.value.name || "",
    };
    this.service.addCourse(course).subscribe({
      next: () => {
        this.getCourses();
      }
    });
  }

  updateCourse(): void {
    const course: Course = {
      name: this.courseForm.value.name || "",
    };
    //course.id = this.course.id;
    this.service.updateCourse(course).subscribe({
      next: () => {}
    });
  }

}