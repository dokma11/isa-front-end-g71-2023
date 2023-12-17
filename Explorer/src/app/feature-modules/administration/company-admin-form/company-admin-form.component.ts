import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyAdmin, UserRole } from '../model/company-admin.model';
import { AdministrationService } from '../administration.service';
import { Router } from '@angular/router';
import { Login } from 'src/app/infrastructure/auth/model/login.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-company-admin-form',
  templateUrl: './company-admin-form.component.html',
  styleUrls: ['./company-admin-form.component.css']
})
export class CompanyAdminFormComponent implements OnChanges{
  @Output() companyAdminUpdated = new EventEmitter<null>();
  @Input() companyAdmin: CompanyAdmin;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService,
              private router: Router,
              private authService: AuthService) {}

  ngOnChanges(): void{
    this.companyAdminForm.reset();
      if (this.shouldEdit) {
          const companyAdminToPatch = {
            name: this.companyAdmin.name || null,
            surname: this.companyAdmin.surname || null,
            username: this.companyAdmin.username || null,
            password:  this.companyAdmin.password || null,
            companyInformation:  this.companyAdmin.companyInformation || null,
            telephoneNumber:  this.companyAdmin.telephoneNumber || null,
            city:  this.companyAdmin.city || null,
            state:  this.companyAdmin.state || null,
            role:  UserRole.COMPANY_ADMINISTRATOR.toString() || null,
            profession:  this.companyAdmin.profession || null,
          };
          this.companyAdminForm.patchValue(companyAdminToPatch);
      }
  }

  companyAdminForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    surname: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
    companyInformation: new FormControl("", [Validators.required]),
    telephoneNumber: new FormControl("", [Validators.required]),
    city: new FormControl("", [Validators.required]),
    state: new FormControl("", [Validators.required]),
    role: new FormControl("", [Validators.required]),
    profession: new FormControl("", [Validators.required])
  });

  updateCompanyAdmin(): void {
    const companyAdmin: CompanyAdmin = {
      name: this.companyAdminForm.value.name || "",
      surname: this.companyAdminForm.value.surname || "",
      username: this.companyAdminForm.value.username || "",
      password:  this.companyAdmin.password,
      companyInformation:  this.companyAdminForm.value.companyInformation || "",
      telephoneNumber:  this.companyAdminForm.value.telephoneNumber || "",
      city:  this.companyAdminForm.value.city || "",
      state:  this.companyAdminForm.value.state || "",
      role:  UserRole.COMPANY_ADMINISTRATOR,
      profession:  this.companyAdminForm.value.profession || "",
    };

    companyAdmin.id = this.companyAdmin.id;
    companyAdmin.verified = true;
    companyAdmin.password = this.companyAdmin.password;

    if(this.companyAdminForm.value.name != "" &&
      this.companyAdminForm.value.surname != "" &&
      this.companyAdminForm.value.username != "" &&
      this.companyAdminForm.value.companyInformation != "" &&
      this.companyAdminForm.value.telephoneNumber != "" &&
      this.companyAdminForm.value.city != "" &&
      this.companyAdminForm.value.state != "" &&
      this.companyAdminForm.value.profession != ""){
      this.service.updateCompanyAdministrator(companyAdmin).subscribe({
        next: _ => {
          /*
            const login: Login = {
              username: this.companyAdmin.username || "",
              password: this.companyAdmin.password || "",
            };
        
            this.authService.login(login).subscribe({
              next: () => {
                location.reload();
              },
            }); */
            location.reload();
        },
      });
    }
    else{
      alert("The fields are not filled correctly!")
    }
  }
}
