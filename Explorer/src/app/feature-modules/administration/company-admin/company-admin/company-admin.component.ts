import { Component, OnInit } from '@angular/core';
import { CompanyAdmin, UserRole } from '../../model/company-admin.model';
import { AdministrationService } from '../../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CompanyAdminPasswordFormComponent } from '../../company-admin-password-form/company-admin-password-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CompanyAdminFormComponent } from '../../company-admin-form/company-admin-form.component';

@Component({
  selector: 'xp-company-admin',
  templateUrl: './company-admin.component.html',
  styleUrls: ['./company-admin.component.css']
})
export class CompanyAdminComponent implements OnInit{

  user: User | undefined;
  companyAdmin: CompanyAdmin = {
    name : "",
    surname: "",
    password: "",
    username: "",
    companyInformation: "",
    telephoneNumber: "",
    city: "",
    state: "",
    role: UserRole.COMPANY_ADMINISTRATOR,
    profession: ""
  };
  selectedCompanyAdmin: CompanyAdmin;
  shouldEdit: boolean = false;
  shouldRenderCompanyAdminForm: boolean = false;
  shouldRenderCompanyAdminPasswordForm: boolean = false;
  private dialogRef: any;

  constructor(private service: AdministrationService,
              private authService: AuthService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.getAdmin(this.user.id);
    });
  }

  getAdmin(id: number): void{
    this.service.getCompanyAdministratorByid(id).subscribe({
      next: (result: CompanyAdmin) => {
        if(result){
          this.companyAdmin = result;
        }
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }

  onEditClicked(companyAdmin: CompanyAdmin): void {
    this.dialogRef = this.dialog.open(CompanyAdminFormComponent, {
      data: companyAdmin,
    });
  }

  onEditPasswordClicked(companyAdmin: CompanyAdmin): void {
    this.dialogRef = this.dialog.open(CompanyAdminPasswordFormComponent, {
      data: companyAdmin,
    });
  }
}
