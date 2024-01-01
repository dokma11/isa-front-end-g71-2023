import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AppointmentsComponent } from '../appointments/appointments.component';
import { Appointment, AppointmentStatus } from '../model/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CompaniesService } from '../companies.service';
import { CompanyAdmin } from '../../administration/model/company-admin.model';
import { Company } from '../model/company.model';
import { RegisteredUser } from '../../users/model/registered-user.model';

@Component({
  selector: 'xp-company-appointments',
  templateUrl: './company-appointments.component.html',
  styleUrls: ['./company-appointments.component.css']
})
export class CompanyAppointmentsComponent implements OnInit{

  user: User | undefined;
  registeredUsers: RegisteredUser[] = [];
  registeredUsersIds: number[] = [];

  appointment: Appointment;
  appointments: Appointment[] = [];
  timeString: string = "";
  dateString: string = "";

  dialogRef: any;

  constructor(private service: CompaniesService, 
              public dialog: MatDialog,
              private authService: AuthService) { } 


  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getAdminById(this.user.id).subscribe({
        next: (result: CompanyAdmin) => {
          if(result){
            this.service.getCompanyById(result.company?.id!).subscribe({
              next: (result: Company) => {
                  this.getAppointments(result);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error fetching companies:', err);
        },
      });
    });
  }

  getAppointments(company: Company): void{
    this.service.getCompaniesAppointments(company).subscribe({
      next: (result: Appointment | Appointment[]) =>{
        if (Array.isArray(result)) {
          this.appointments = result;
          for (let appointment of this.appointments) {
            appointment.companyId = company.id || 0;
  
            if(appointment.user?.id){
              this.service.getUserByid(appointment.user.id).subscribe({
                next: (result: RegisteredUser) => {
                  if(!this.registeredUsersIds.includes(appointment.user?.id!)){                    
                    this.registeredUsers.push(result);
                    this.registeredUsersIds.push(appointment.user?.id!);
                  }
                  
                  [appointment.dateString, appointment.timeString] = appointment.pickupTime.toString().split('T');

                  this.checkForExpired();
                }
              })
            }

            [appointment.dateString, appointment.timeString] = appointment.pickupTime.toString().split('T');
          }
        }
        else{
          this.appointments = [result];
        }
      }
    });

    this.checkForExpired();

  }

  onDeleteAppointmentClicked(appointment: Appointment): void{
    if(appointment.id && !appointment.user?.id){  
      this.service.deleteAppointment(appointment.id).subscribe({
        next: () => {
          location.reload();
        }
      })
    }
    else{
      alert("Can not delete a busy appointment!");
    }
  }  

  onAddClicked(): void{
    this.dialogRef = this.dialog.open(AppointmentsComponent, {
      data: this.appointment,
    });
  }
  
  onMarkAsPickedUpClicked(appointment: Appointment): void {
    if(appointment.id && appointment.user?.id){  
      if(appointment.status.toString() === "ON_HOLD"){
        appointment.status = AppointmentStatus.IN_PROGRESS;
        this.service.updateAppointment(appointment).subscribe({
          next: () => { location.reload(); }
        })
      }
    }
    // mozda dodati malo vise jasnjih alertova
    else{
      alert("Can not mark that appointment as picked up!");
    }
  }

  checkForExpired(): void{
    for (let appointment of this.appointments) {
      // da li je rok preuzimanja prosao
      if(appointment.status.toString() === "ON_HOLD"){
        const currentDate = new Date();
        const appointmentPickUpTimeDate = new Date(appointment.pickupTime.toString());

        if(appointmentPickUpTimeDate < currentDate){
          appointment.status = AppointmentStatus.EXPIRED;
          this.service.updateAppointment(appointment).subscribe({
            next : () => {}
          });
        }
      }
    }
  }
}
