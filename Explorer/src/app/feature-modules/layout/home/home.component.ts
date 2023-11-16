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
  
  constructor(private service: LayoutService) {}

  ngOnInit(): void {
  }
}