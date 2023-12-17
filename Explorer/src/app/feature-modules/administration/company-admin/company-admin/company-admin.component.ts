import { Component, OnInit } from '@angular/core';
import { CompanyAdmin, UserRole } from '../../model/company-admin.model';
import { AdministrationService } from '../../administration.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

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

  constructor(private service: AdministrationService,
              private authService: AuthService) { }

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
    this.shouldEdit = true;
    this.selectedCompanyAdmin = companyAdmin;
    this.shouldRenderCompanyAdminForm = true;
    this.shouldRenderCompanyAdminPasswordForm = false;
  }

  onEditPasswordClicked(companyAdmin: CompanyAdmin): void {
    this.shouldEdit = true;
    this.selectedCompanyAdmin = companyAdmin;
    this.shouldRenderCompanyAdminPasswordForm = true;
    this.shouldRenderCompanyAdminForm = false;
  }
}
