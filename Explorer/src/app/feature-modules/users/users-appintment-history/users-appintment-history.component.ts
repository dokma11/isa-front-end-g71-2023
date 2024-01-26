import { Component } from '@angular/core';
import { Appointment } from '../../companies/model/appointment.model';
import { UsersServiceService } from '../users.service.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AppointmentEquipmentViewComponent } from '../appointment-equipment-view/appointment-equipment-view.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'xp-users-appintment-history',
  templateUrl: './users-appintment-history.component.html',
  styleUrls: ['./users-appintment-history.component.css']
})
export class UsersAppintmentHistoryComponent {

  appointments: Appointment[] = [];
  loggedInUser: User | undefined;
  dialog: any;
  displayedColumns: string[] = ['pickupTime', 'duration', 'companyName', 'companyAdminName', 'actions'];
  dataSource = new MatTableDataSource<Appointment>();
  constructor(private service: UsersServiceService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.loggedInUser = user;
    });
    this.getDoneAppointments();
  }

  getDoneAppointments(): void {
    this.service.getDoneAppointments(this.loggedInUser?.id || 0).subscribe({
      next: (result: Appointment | Appointment[]) => {
        if (Array.isArray(result)) {
          this.appointments = result;
        } else {
          this.appointments = [result];
        }
        for (let appointment of this.appointments){
          appointment.dateFormated = appointment.pickupTime.toString().replace('T', ' ');
        }
       
      },
      error: () => {
        console.log('Nije ucitao');
      },
    });
  }

  sortBy: keyof Appointment = 'pickupTime'; // Default sorting by pickupTime
  sortOrder = 'asc'; // Default sorting order

  // Function to toggle sorting order
  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortAppointments();
  }

  // Function to sort the appointments
  sortAppointments() {
    this.appointments.sort((a, b) => {
      const order = this.sortOrder === 'asc' ? 1 : -1;

      if (this.sortBy === 'pickupTime') {
        return (new Date(a.pickupTime).getTime() - new Date(b.pickupTime).getTime()) * order;
      } else if (this.sortBy === 'duration') {
        return (a.duration - b.duration) * order;
      }

      return 0; // No sorting if sortBy is not recognized
    });
  }


}
