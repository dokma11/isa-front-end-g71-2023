import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../companies.service';
import { Equipment } from '../../administration/model/equipment.model';
import { Appointment } from '../model/appointment.model';
import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { AppointmentsComponent } from '../appointments/appointments.component';
import { MatDialog } from "@angular/material/dialog";
import { EquipmentComponent } from '../../administration/equipment/equipment.component';
import { CompanyAdmin } from '../../administration/model/company-admin.model';
import { DatePipe } from '@angular/common'; 

@Component({
  selector: 'xp-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit{
  





  // DODAJ LISTU ADMINA KOMPANIJE DA SE ISPISE







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

  sEquipment: Equipment;
  selectedEquipment: Equipment[] = [];
  equipment: Equipment;
  companiesEquipment: Equipment[] = [];
  shouldRenderEquipmentForm: boolean = false;

  appointment: Appointment;
  appointments: Appointment[] = [];
  selectedAppointment: Appointment;
  shouldRenderAppointmentsForm: boolean = false;
  timeString: string = "";
  dateString: string = "";

  administrators: CompanyAdmin[] = [];

  //public map!: Map;
  predefinedAppointments: Appointment[] = [];
  exceptional: boolean = false;
  selectedDate: Date;
  timeSlots: any;

  constructor(private service: CompaniesService, 
              public dialogRef: MatDialog,
              private datePipe: DatePipe) { } 

  ngOnInit(): void {
    this.getCompanies();
/*
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view: new View({ 
        center: [0, 0],
        zoom: 2,maxZoom: 18, 
      }),
    });
  */ 
  }

  getCompanies(): void{
    this.service.getCompanyById(-1).subscribe({
      next: (result: Company) => {
          this.company = result;
          this.service.getCompaniesEquipment(this.company).subscribe({
              next: (result: Equipment | Equipment[]) =>{
                if (Array.isArray(result)) {
                  this.companiesEquipment = result;
                  
                  // ovde namestam listu equipmenta i sta sa njom

                }
                else{
                  this.companiesEquipment = [result];
                }
              }
            });

          this.service.getCompaniesAppointments(this.company).subscribe({
            next: (result: Appointment | Appointment[]) =>{
              if (Array.isArray(result)) {
                this.appointments = result;
                for (let appointment of this.appointments) {
                  appointment.companyId = this.company.id || 0;
                
                  //[appointment.dateString, appointment.timeString] = appointment.pickupTime.toString().split('T');
                
                }
              }
              else{
                this.appointments = [result];
              }
            }
          });

          this.service.getCompaniesAdministrators(this.company).subscribe({
            next: (result: CompanyAdmin | CompanyAdmin[]) =>{
              if (Array.isArray(result)) {
                this.administrators = result;
              }
              else{
                this.administrators = [result];
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

  onDeleteAppointmentClicked(appointment: Appointment): void{
    if(appointment.id){  
      // menjaj
      this.service.deleteCompany(appointment.id).subscribe({
        next: () => {
          this.getCompanies();
        }
      })
    }
  }  

  onAddClicked(): void{
    this.dialogRef.open(AppointmentsComponent, {
      data: this.appointment,
    });
  }

  onDeleteEquipmentClicked(equipment: Equipment): void{
    if(equipment.id){  
      this.service.deleteEquipment(equipment.id).subscribe({
        next: () => {
          this.getCompanies();
        }
      })
    }
  }

  onAddEquipmentClicked(): void{
    this.dialogRef.open(EquipmentComponent, {
      data: this.equipment,
    });
  }

  onEditEquipmentClicked(equipment: Equipment): void{
    this.shouldEdit = true;
    this.sEquipment = equipment;
    this.shouldRenderEquipmentForm = true;
  } 

  getEquipment(): void{

  }


  addEquipment(eq: Equipment):void{
      if(!this.selectedEquipment.includes(eq)){
        this.selectedEquipment.push(eq);
      }
      
  }

  removeEquipmnet(index: number): void {
      this.selectedEquipment.splice(index, 1);
  }  
}
