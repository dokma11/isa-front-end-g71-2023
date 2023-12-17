import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../layout.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CompanyAdmin, UserRole } from '../../administration/model/company-admin.model';
import { CompaniesService } from '../../companies/companies.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  user: User | undefined;
  shouldUpdatePassword: boolean = false;
  companyAdmin: CompanyAdmin;

  constructor(private service: LayoutService,
              private authService: AuthService,
              private companiesService: CompaniesService,
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
}