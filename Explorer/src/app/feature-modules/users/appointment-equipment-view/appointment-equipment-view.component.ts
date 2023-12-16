import { Component, Inject } from '@angular/core';
import { UsersServiceService } from '../users.service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Equipment } from '../../administration/model/equipment.model';

@Component({
  selector: 'xp-appointment-equipment-view',
  templateUrl: './appointment-equipment-view.component.html',
  styleUrls: ['./appointment-equipment-view.component.css'],
})
export class AppointmentEquipmentViewComponent {
  equipment: Equipment[] = [];
  appointmentId: number = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: UsersServiceService
  ) {}

  ngOnInit() {
    this.appointmentId = this.data.appointmentId;

    this.service.getAppointmentsEquipment(this.appointmentId).subscribe({
      next: (result: Equipment[]) => {
        this.equipment = result;
      },
    });
  }
}
