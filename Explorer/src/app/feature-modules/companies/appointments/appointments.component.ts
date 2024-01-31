import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Appointment, AppointmentStatus, AppointmentType } from '../model/appointment.model';
import { CompaniesService } from '../companies.service';
import { CompanyAdmin } from '../../administration/model/company-admin.model';
import { Company } from '../model/company.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';

@Component({
  selector: 'xp-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnChanges{

  @Output() appointmentUpdated = new EventEmitter<null>();
  @Input() appointment: Appointment;
  @Input() shouldEdit: boolean = false;

  user: User | null;
  minDate: Date;  
  administrators: CompanyAdmin[];
  adminAdded: boolean = false;
  chosenAdmin: CompanyAdmin;

  constructor(private service: CompaniesService,
              private authService: AuthService) {
                
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);   

    this.minDate = tomorrow;

    // zatim proveri koji je slobodan (ja bih to kasnije u onom sranju kako sam ranije odradio)
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getAdminById(this.user.id).subscribe({
        next: (result: CompanyAdmin) => {
          if(result){
            this.service.getCompaniesAdministrators(result.company!).subscribe({
              next: (result: CompanyAdmin | CompanyAdmin[]) =>{
                if (Array.isArray(result)) {
                  this.administrators = result;
                }
                else{
                  this.administrators = [result];
                }
              },
              error: (err) => {
                console.error('Error fetching administrators:', err);
              },
            });
          }
        },
        error: (err) => {
          console.error('Error fetching administrator:', err);
        },
      });
    });
  }

  ngOnChanges(): void {
    this.appointmentForm.reset();
    if(this.shouldEdit) {
      const appointmentPatch = {
        pickupTime: this.appointment.pickupTime || null,
        duration: this.appointment.duration?.toString() || null
      };
    }
  }

  appointmentForm = new FormGroup({
    administratorEmail: new FormControl('',[Validators.required]),
    pickupDate: new FormControl(null,[Validators.required]),
    pickupTime: new FormControl(null,[Validators.required]),
    duration: new FormControl('',[Validators.required])
  });

  addAppointment(): void {
    const appointment: Appointment = {
      pickupTime: new Date(),
      duration: 30,
      status: AppointmentStatus.ON_HOLD,
      type: AppointmentType.PREDEFINED,
    };
    
          appointment.administratorId = this.chosenAdmin.id;
          appointment.companyId = this.chosenAdmin.company?.id || 0;

          this.service.getCompanyById(appointment.companyId).subscribe({
            next: (result: Company) => {
              const dateValue: Date | null = this.appointmentForm.value.pickupDate!;
              const timeValue: string | null = this.appointmentForm.value.pickupTime!;

              const startTime: string = result.workingHoursStart!;
              const endTime: string = result.workingHoursEnd!;

              if (dateValue !== null && timeValue !== null && this.isTimeBetween(startTime, endTime, timeValue)) {
                const [hours, minutes] = (timeValue as string).split(':'); 
                const dateTime = new Date(dateValue);
                dateTime.setHours(Number(hours) + 1);
                dateTime.setMinutes(Number(minutes));
                
                const d = new Date(dateValue);
                d.setHours(Number(hours));
                d.setMinutes(Number(minutes));

                appointment.pickupTime = dateTime;
                
                this.service.getCompaniesAppointments(result).subscribe({
                  next: (result: Appointment[] | Appointment) => {
                    if (Array.isArray(result)) {
                      let invalid = false;

                      for(let a of result){
                        const startDate: Date = new Date(a.pickupTime);
                        const endDate: Date = new Date(startDate);
                        endDate.setMinutes(startDate.getMinutes() + 30); 

                        if(a.administrator?.id === appointment.administratorId &&
                          this.isDateInRange(d, startDate, endDate)){
                            invalid = true;
                          }
                      }

                      if(!invalid){
                        this.service.addAppointment(appointment).subscribe({
                          next: () => { 
                            this.appointmentUpdated.emit();
                            location.reload(); 
                          }
                        });
                      }
                      else{
                        alert("The time slot is already taken!");
                      }
                    }
                    else{
                      [result];
                    }
                  }
                })
              }
              else{
                alert("Invalid input!");
              }

            }
      });
  }

  isTimeBetween(startTime: string, endTime: string, targetTime: string): boolean {
    const parseTime = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes; 
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    const targetMinutes = parseTime(targetTime);

    return startMinutes <= targetMinutes && targetMinutes <= endMinutes;
  } 

  isDateInRange(dateToCheck: Date, startDate: Date, endDate: Date): boolean {
    const isSameDate = dateToCheck.getFullYear() === startDate.getFullYear() &&
        dateToCheck.getMonth() === startDate.getMonth() &&
        dateToCheck.getDate() === startDate.getDate();

    if (!isSameDate) {
        return false;
    }

    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const checkTime = dateToCheck.getTime();

    return checkTime >= startTime && checkTime <= endTime;
  }

  onAddAdminClicked(admin: CompanyAdmin): void{
    this.chosenAdmin = admin;
    alert("You have chosen admin " + this.chosenAdmin.name + " " + this.chosenAdmin.surname);
  }
}
