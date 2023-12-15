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
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
})
export class UserUpdateComponent implements OnInit {
  regiteredUser: RegisteredUser = {
    name: '',
    surname: '',
    password: '',
    email: '',
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
  user: User | undefined;
  constructor(private service: UsersServiceService,private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getUser(user.id);
    });
  }

  onEditClicked(user: RegisteredUser): void {
    this.selectedUser = user;
    this.shouldRenderUserForm = true;
    this.shouldEdit = true;
  }
  getUser(id :number): void {
    this.service.getOne(id).subscribe({
      next: (result: RegisteredUser) => {
        if (result) {
          this.regiteredUser = result;
        }
      },
      error: () => {
        console.log('Nije ucitao');
      },
    });
  }
}
