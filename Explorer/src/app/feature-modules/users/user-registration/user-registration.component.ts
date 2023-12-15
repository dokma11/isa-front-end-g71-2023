import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisteredUser } from '../model/registered-user.model';
import { UsersServiceService } from '../users.service.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { Login } from 'src/app/infrastructure/auth/model/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent {
  @Output() userUpdated = new EventEmitter<null>();
  @Input() user: RegisteredUser;
  @Input() shouldEdit: boolean = false;

  constructor(
    private service: UsersServiceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnChanges(): void {
    this.registrationFrom.reset();
    if (this.shouldEdit) {
      this.registrationFrom.patchValue(this.user);
      this.registrationFrom.controls.password.setValue('');
    }
  }

  ngOnInit(): void {
    this.registrationFrom.reset();
    if (this.shouldEdit) {
      this.registrationFrom.patchValue(this.user);
    }
    this.registrationFrom.controls.password.setValue(''); // we dont want to display encrypted password
  }
  registrationFrom = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    renteredPassword: new FormControl('', [Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    profession: new FormControl('', [Validators.required]),
    companyInformation: new FormControl('', [Validators.required]),
  });

  register(): void {
    const user: RegisteredUser = {
      name: this.registrationFrom.value.name || '',
      surname: this.registrationFrom.value.surname || '',
      email: this.registrationFrom.value.email || '',
      password: this.registrationFrom.value.password || '',
      telephoneNumber: this.registrationFrom.value.telephoneNumber || '',
      city: this.registrationFrom.value.city || '',
      state: this.registrationFrom.value.state || '',
      profession: this.registrationFrom.value.profession || '',
      companyInformation: this.registrationFrom.value.companyInformation || '',
      role: '',
      points: 0,
    };
    if (
      this.registrationFrom.value.name == '' ||
      this.registrationFrom.value.surname == '' ||
      this.registrationFrom.value.city == '' ||
      this.registrationFrom.value.state == '' ||
      this.registrationFrom.value.telephoneNumber == '' ||
      this.registrationFrom.value.profession == '' ||
      this.registrationFrom.value.companyInformation == '' ||
      this.registrationFrom.value.password == '' ||
      this.registrationFrom.value.renteredPassword == '' ||
      this.registrationFrom.value.password !=
        this.registrationFrom.value.renteredPassword
    ) {
      alert('Fileds are not filled validly');
    } else {
      this.service.register(user).subscribe({
        next(result) {
          alert(
            'You have successfully registered! Check your email for notifications.'
          );
          console.log(result);
        },
      });
    }
  }

  updateUser() {
    const user: RegisteredUser = {
      name: this.registrationFrom.value.name || '',
      surname: this.registrationFrom.value.surname || '',
      city: this.registrationFrom.value.city || '',
      state: this.registrationFrom.value.state || '',
      telephoneNumber: this.registrationFrom.value.telephoneNumber || '',
      profession: this.registrationFrom.value.profession || '',
      companyInformation: this.registrationFrom.value.companyInformation || '',
      password: this.registrationFrom.value.password || '',
      email: this.registrationFrom.value.email || '',
      role: '',
      points: 0,
    };
    user.id = this.user.id;

    if (
      this.registrationFrom.value.name == '' ||
      this.registrationFrom.value.surname == '' ||
      this.registrationFrom.value.city == '' ||
      this.registrationFrom.value.state == '' ||
      this.registrationFrom.value.telephoneNumber == '' ||
      this.registrationFrom.value.profession == '' ||
      this.registrationFrom.value.companyInformation == ''
      //this.registrationFrom.value.password == '' ||
      //this.registrationFrom.value.renteredPassword == '' ||
      //this.registrationFrom.value.password !=
      //  this.registrationFrom.value.renteredPassword
    ) {
      alert('Fileds are not filled validly');
    } else {
      if (
        //check if the password has been changed
        this.registrationFrom.value.password != '' &&
        this.registrationFrom.value.password !=
          this.registrationFrom.value.renteredPassword
      ) {
        alert('Fileds are not filled validly');
      } else {
        this.service.update(user).subscribe({
          next: () => {
            if (this.registrationFrom.value.password != '') {
              //if the password has been changed user must log in again
              alert('User updated! Password reset! Please log in again');
              this.authService.logout();
              this.router.navigate(['/']);
            } else {
              alert('Account updated successfully!');
              this.userUpdated.emit();
            }
          },
        });
      }
    }
  }
}
