import { Component, inject } from '@angular/core';
import { Company } from '../model/company.model';
import { Equipment } from '../../administration/model/equipment.model';
import { Appointment } from '../model/appointment.model';
import { CompaniesService } from '../companies.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'xp-company-user-view',
  templateUrl: './company-user-view.component.html',
  styleUrls: ['./company-user-view.component.css']
})
export class CompanyUserViewComponent {

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
  timeSlots: any;
  id:number
  route = inject(ActivatedRoute);

  constructor(private service: CompaniesService,private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'))
    this.getCompanies();
    this.selectedEquipment = [];
  }

  getCompanies(): void{
    this.service.getCompanyById(this.id).subscribe({
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    // Format: YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }

  onDateSelected(): void {
    if (this.selectedDate && this.company && this.company.id) {
      const companyId = this.company.id;
      const localDate = new Date(this.selectedDate.getTime() - this.selectedDate.getTimezoneOffset() * 60000);
      const formattedDate = localDate.toISOString().slice(0, 19).replace('T', ' '); // Implement formatDate as needed
      const startTime = '2023-12-06 08:00:00'; // Set the start time PROMENTII KAD SE IMPLEMENTIRA RADNO VREME KOMPANIEJ
      const endTime = '2023-12-06 16:00:00'; // Set the end time PROMENTII KAD SE IMPLEMENTIRA RADNO VREME KOMPANIEJ

      this.service.getFreeTimeSlots(companyId, formattedDate, startTime, endTime).subscribe({
        next: (freeTimeSlots: any) => {
          // Handle the freeTimeSlots data and update your UI as needed
          this.timeSlots = freeTimeSlots;
        },
        error: (error) => {
          console.error('Error fetching free time slots:', error);
        }
      });
    }
  }
}
