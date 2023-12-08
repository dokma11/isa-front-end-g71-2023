import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../companies.service';
import { Equipment } from '../../administration/model/equipment.model';
import { Appointment } from '../model/appointment.model';

@Component({
  selector: 'xp-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit{
  
  company: Company = {
    name: "",
    address: "",
    longitude: 0.0,
    latitude: 0.0,
    description: "",
    averageGrade: 0.0,
  };
  selectedCompany: Company;
  shouldEdit: boolean = false;
  shouldRenderCompaniesForm: boolean = false;
  companiesEquipment: Equipment[] = [];
  selectedEquipment: Equipment[] = [];
  predefinedAppointments: Appointment[] = [];
  exceptional: boolean = false;
  selectedDate: Date;

  constructor(private service: CompaniesService) { }

  ngOnInit(): void {
    this.getCompanies();
    this.selectedEquipment = [];
  }

  getCompanies(): void{
    this.service.getCompanyById(1).subscribe({
      next: (result: Company) => {
          this.company = result;
          this.service.getCompaniesEquipment(this.company).subscribe({
              next: (result: Equipment | Equipment[]) =>{
                if (Array.isArray(result)) {
                  this.companiesEquipment = result;
                  this.company.equipment = "";
                  for(let ce of this.companiesEquipment){
                    if(this.company.equipment == ""){
                      this.company.equipment += ce.name;
                    }
                    else{
                      this.company.equipment += ", " + ce.name;
                    }
                  }
                }
                else{
                  this.companiesEquipment = [result];
                }
              }
            });
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

  addEquipment(eq: Equipment):void{
      if(!this.selectedEquipment.includes(eq)){
        this.selectedEquipment.push(eq);
      }
      
  }

  removeEquipmnet(index: number): void {
      this.selectedEquipment.splice(index, 1);
  }

  getPredefidedAppointments(id: number):void{
    if (id !== undefined) {
    this.service.getCompanysPredefinedAppointments(id).subscribe({
      next: (result: Appointment | Appointment[]) => {
        if (Array.isArray(result)) {
          this.predefinedAppointments = result;
        }
        else{
          this.predefinedAppointments = [result];
        }
      }
    })
  }
  }


  changeExc():void{
    this.exceptional = true;
  }
}
