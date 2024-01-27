import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CompanyAdmin, UserRole } from '../../administration/model/company-admin.model';
import { CompaniesService } from '../../companies/companies.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisteredUser } from '../../users/model/registered-user.model';
import { UsersServiceService } from '../../users/users.service.service';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  user: User | undefined;
  shouldUpdatePassword: boolean = false;
  companyAdmin: CompanyAdmin;
  //registeredUser: RegisteredUser;
  registeredUser: RegisteredUser = {
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
  constructor(private service: LayoutService,
              private authService: AuthService,
              private companiesService: CompaniesService,
              private userService: UsersServiceService,
              private router: Router
              ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;

      if(this.user.role == "ROLE_COMPANY_ADMINISTRATOR"){
        this.companiesService.getAdminById(this.user.id).subscribe({
          next: (result: CompanyAdmin) =>{
            this.companyAdmin = result;

            if(this.companyAdmin.verified == false){
              this.shouldUpdatePassword = true;
            }

          }
        });
      }

      if(this.user.role == "ROLE_REGISTERED_USER"){
        this.companiesService.getUserByid(this.user.id).subscribe({
          next: (result: RegisteredUser) =>{
            this.registeredUser = result;

            const currentDate = new Date();
            if (currentDate.getDate() === 1){
              this.registeredUser.points = 0;
              this.registeredUser.password = '';
              this.userService.update(this.registeredUser).subscribe({
                next: () => {
                  console.log('Updatovan je');
                },
                error: (err) => {
                  console.error('Error updating user:', err);
                },
              });
            } 
            
          }
        });
      }


    });
  }

  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    passwordRepeated: new FormControl('', [Validators.required])
  });

  changePassword(): void{
    if(this.passwordForm.value.password === this.passwordForm.value.passwordRepeated){
      
      this.companyAdmin.verified = true;
      this.companyAdmin.password = this.passwordForm.value.password || "";
      
      this.companiesService.updateCompanyAdministrator(this.companyAdmin).subscribe({
        next: (result: CompanyAdmin) => {
          this.authService.logout();

          this.router.navigate(['/login']);
        }
      });
    }
  }

  companyAdminManageProfile(): void{
    this.router.navigate(['/company-administrators']);
  }

  companyAdminManageCompanyProfile(): void{
    this.router.navigate(['/companies']);
  }

  companyAdminManageUserAppointments(): void{
    this.router.navigate(['/appointments']);
  }




  registeredUserManageProfile(): void{
    this.router.navigate(['/userProfile']);
  }

  registeredUserQRCodes(): void{
    this.router.navigate(['/qrCodes']);
  }
  registeredUserAppointementHistory(): void{
    this.router.navigate(['/appointmentHistory']);
  }

  companiesForUsers(): void{
    this.router.navigate(['/searchCompanies']);
  }
  



}