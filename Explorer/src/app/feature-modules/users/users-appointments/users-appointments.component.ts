import { Component } from '@angular/core';
import { UsersServiceService } from '../users.service.service';
import { Router } from '@angular/router';
import { Appointment } from '../../companies/model/appointment.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentEquipmentViewComponent } from '../appointment-equipment-view/appointment-equipment-view.component';

@Component({
  selector: 'xp-users-appointments',
  templateUrl: './users-appointments.component.html',
  styleUrls: ['./users-appointments.component.css'],
})
export class UsersAppointmentsComponent {
  appointments: Appointment[] = [];
  user: User;
  constructor(
    private service: UsersServiceService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.getAppointments();
  }

  ngOnChannge() {
    this.getAppointments();
  }
  getAppointments(): void {
    this.service.getAppointments(this.user.id).subscribe({
      next: (result: Appointment[]) => {
        this.appointments = result;
      },
    });
  }

  seeEquipment(appointmentId: number): void {
    // opening of the dialog
    const dialogRef = this.dialog.open(AppointmentEquipmentViewComponent, {
      width: '600px',
      height: '550px',
      data: { appointmentId: appointmentId }, // Pass your data here
    });
  }
}
