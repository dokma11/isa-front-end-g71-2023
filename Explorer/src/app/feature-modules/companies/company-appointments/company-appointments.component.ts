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
  companyAdmin:  CompanyAdmin;
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
            this.companyAdmin = result;
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

                  
                }
              })
            }else{
              
            }

            [appointment.dateString, appointment.timeString] = appointment.pickupTime.toString().split('T');
          }
        }
        else{
          this.appointments = [result];
          
        }
      }
    });

    

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
    if(this.companyAdmin.id == appointment.administrator?.id){
      const now: Date = new Date();
      if(appointment.id && appointment.user?.id){  
        if(appointment.status.toString() === "ON_HOLD"){

          const newDate: Date = new Date(appointment.pickupTime);
          if(newDate <= now){
            appointment.status = AppointmentStatus.IN_PROGRESS;
            this.service.pickUpAppointment(appointment).subscribe({
              next: () => { location.reload(); }
            })
          }else{
            alert("Can not mark as picked up because appointment did not start yet!");
          }
        }
        
      }
    else{
      alert("Can not mark that appointment as picked up!");
    }
    }
    else{
      alert("Can not mark appointment as ready because you are not in charge for this appointement");
    }
    
    
  }

}
