import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../companies.service';
import { Equipment } from '../../administration/model/equipment.model';

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
  companiesEquipment: Equipment[] = [];

  constructor(private service: CompaniesService) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(): void{
    this.service.getCompanies().subscribe({
      next: (result: Company | Company[]) => {
        if (Array.isArray(result)) {
          this.companies = result;
          let i=0;
          for(let c of this.companies){
            this.service.getCompaniesEquipment(c).subscribe({
              next: (result: Equipment | Equipment[]) =>{
                if (Array.isArray(result)) {
                  this.companiesEquipment = result;
                  c.equipment = "";
                  for(let ce of this.companiesEquipment){
                    if(c.equipment == ""){
                      c.equipment += ce.name;
                    }
                    else{
                      c.equipment += ", " + ce.name;
                    }
                  }
                }
                else{
                  this.companiesEquipment = [result];
                }
              }
            });
          }
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
