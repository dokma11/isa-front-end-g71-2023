import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../companies.service';

@Component({
  selector: 'xp-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit{
  
  companies: Company[] = [];
  selectedCompany: Company;
  shouldEdit: boolean = false;
  shouldRenderCompaniesForm: boolean = false;

  constructor(private service: CompaniesService) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void{
    this.service.getCompanies().subscribe({
      next: (result: Company | Company[]) => {
        if (Array.isArray(result)) {
          this.companies = result;
        } else {
          this.companies = [result];
        }
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }

  onEditClicked(company: Company): void {
    this.shouldEdit = true;
    this.selectedCompany = company;
    this.shouldRenderCompaniesForm = true;
  }

  onDeleteClicked(company: Company): void{
    if(company.id){  
      this.service.deleteCompany(company.id).subscribe({
        next: () => {
          this.getCompanies();
        }
      })
    }
  }
}
