import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CompanyAdmin, UserRole } from '../model/company-admin.model';
import { AdministrationService } from '../administration.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-company-admin-password-form',
  templateUrl: './company-admin-password-form.component.html',
  styleUrls: ['./company-admin-password-form.component.css']
})
export class CompanyAdminPasswordFormComponent implements OnChanges{
  @Output() companyAdminUpdated = new EventEmitter<null>();
  @Input() companyAdmin: CompanyAdmin;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService,
              private authService: AuthService,
              private router: Router) {}

  ngOnChanges(): void{
    this.companyAdminForm.reset();
  }

  companyAdminForm = new FormGroup({
    password: new FormControl("", [Validators.required]),
    passwordRepeated: new FormControl("", [Validators.required])
  });

  updateCompanyAdmin(): void {
    const companyAdmin: CompanyAdmin = {
      name: this.companyAdmin.name || "",
      surname: this.companyAdmin.surname || "",
      username: this.companyAdmin.username || "",
      password:  this.companyAdminForm.value.password || "",
      companyInformation:  this.companyAdmin.companyInformation || "",
      telephoneNumber:  this.companyAdmin.telephoneNumber || "",
      city:  this.companyAdmin.city || "",
      state:  this.companyAdmin.state || "",
      role:  UserRole.COMPANY_ADMINISTRATOR,
      profession:  this.companyAdmin.profession || "",
    };

    companyAdmin.id = this.companyAdmin.id;
    companyAdmin.verified = true;

    if(this.companyAdminForm.value.password != "" &&
      this.companyAdminForm.value.passwordRepeated != "" &&
      this.companyAdminForm.value.password === this.companyAdminForm.value.passwordRepeated){
      this.service.updateCompanyAdministrator(companyAdmin).subscribe({
        next: _ => {
            this.companyAdminUpdated.emit();
            this.authService.logout();

            this.router.navigate(['/login']);
        },
      });
    }
    else{
      alert("The fields are not filled correctly!")
    }
  }
}
