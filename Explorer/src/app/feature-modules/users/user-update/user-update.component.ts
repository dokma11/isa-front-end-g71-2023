import { Component, Input, OnInit } from '@angular/core';
import { RegisteredUser } from '../model/registered-user.model';
import { UsersServiceService } from '../users.service.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PagedResults } from 'src/app/shared/model/paged-results.model';

@Component({
  selector: 'xp-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
})
export class UserUpdateComponent implements OnInit {
  user: RegisteredUser = {
    name: '',
    surname: '',
    password: '',
    username: '',
    companyInformation: '',
    telephoneNumber: '',
    city: '',
    state: '',
    role: '',
    profession: '',
    points: 0,
  };
  id = 1;
  selectedUser: RegisteredUser;
  shouldRenderUserForm: boolean = false;
  shouldEdit: boolean = false;
  constructor(private service: UsersServiceService) {}

  ngOnInit(): void {
    this.getUser();
  }

  onEditClicked(user: RegisteredUser): void {
    this.selectedUser = user;
    this.shouldRenderUserForm = true;
    this.shouldEdit = true;
  }
  getUser(): void {
    this.service.getOne().subscribe({
      next: (result: RegisteredUser) => {
        if (result) {
          this.user = result;
        }
      },
      error: () => {
        console.log('Nije ucitao');
      },
    });
  }
}
