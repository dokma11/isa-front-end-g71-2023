import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Appointment, AppointmentStatus, AppointmentType } from '../model/appointment.model';
import { CompaniesService } from '../companies.service';
import { CompanyAdmin } from '../../administration/model/company-admin.model';
import { Company } from '../model/company.model';

@Component({
  selector: 'xp-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnChanges{

  @Output() appointmentUpdated = new EventEmitter<null>();
  @Input() appointment: Appointment;
  @Input() shouldEdit: boolean = false;

  constructor(private service: CompaniesService) { }

  ngOnChanges(): void {
    this.appointmentForm.reset();
    if(this.shouldEdit) {
      const appointmentPatch = {
        //administrator.: this.appointment.administrator || null,
        pickupTime: this.appointment.pickupTime || null,
        duration: this.appointment.duration?.toString() || null
      };
      //this.appointmentForm.patchValue(appointmentPatch);
    }
  }

  appointmentForm = new FormGroup({
    administratorEmail: new FormControl('',[Validators.required]),
    pickupTime: new FormControl(null,[Validators.required]),
    duration: new FormControl('',[Validators.required])
  });


  addAppointment(): void {
    const appointment: Appointment = {
      pickupTime: new Date(),
      //dateString: "",
      //timeString: "",
      duration: parseInt(this.appointmentForm.value.duration || "0"),
      status: AppointmentStatus.ON_HOLD,
      type: AppointmentType.PREDEFINED,
    };

    // Ovde radim sta sve

    appointment.pickupTime = this.appointmentForm.value.pickupTime!;
    
    // U sustini ne mora samo nadam se da nece praviti problem, dodato je samo zbog prikaza 
    //[appointment.dateString, appointment.timeString] = appointment.pickupTime.toString().split('T');

    // kompanija, admin, user treba da je null

    this.service.getAdminByEmail(this.appointmentForm.value.administratorEmail || "").subscribe({
      next: (result: CompanyAdmin) => {
        appointment.administrator = result;
        appointment.companyId = appointment.administrator.company?.id || 0;
      }
    });
  }

}
