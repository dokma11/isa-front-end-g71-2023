import { Component, OnInit } from '@angular/core';
import { CompanyAdmin } from '../../model/company-admin.model';
import { AdministrationService } from '../../administration.service';

@Component({
  selector: 'xp-company-admin',
  templateUrl: './company-admin.component.html',
  styleUrls: ['./company-admin.component.css']
})
export class CompanyAdminComponent implements OnInit{

  companyAdmin: CompanyAdmin;
  selectedCompanyAdmin: CompanyAdmin;
  shouldEdit: boolean = false;
  shouldRenderCompanyAdminForm: boolean = false;

  constructor(private service: AdministrationService) { }

  ngOnInit(): void {
    this.getAdmin();
  }

  getAdmin(): void{
    this.service.getCompanyAdministratorByid(1).subscribe({
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
  }
}
