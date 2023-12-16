import { Component, inject } from '@angular/core';
import { Company } from '../model/company.model';
import { Equipment } from '../../administration/model/equipment.model';
import { Appointment, Status, Type } from '../model/appointment.model';
import { CompaniesService } from '../companies.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EquipmentQuantity } from '../model/equipmentQuantity.model';
import { RegisteredUser } from '../../users/model/registered-user.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { AvailableEquipmentQuantity } from '../model/availableEquipmentQuantity.model';

@Component({
  selector: 'xp-company-user-view',
  templateUrl: './company-user-view.component.html',
  styleUrls: ['./company-user-view.component.css'],
})
export class CompanyUserViewComponent {
  company: Company = {
    name: '',
    address: '',
    longitude: 0.0,
    latitude: 0.0,
    description: '',
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
  id: number;
  route = inject(ActivatedRoute);
  user: User | undefined;
  administratorIds: number[] = [];
  availableEquipmentQuantity: AvailableEquipmentQuantity[] = []; // for validation

  constructor(
    private service: CompaniesService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getCompanies();
    this.selectedEquipment = [];
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  getCompanies(): void {
    this.service.getCompanyById(this.id).subscribe({
      next: (result: Company) => {
        this.company = result;
        this.service.getCompaniesEquipment(this.company).subscribe({
          next: (result: Equipment | Equipment[]) => {
            if (Array.isArray(result)) {
              this.companiesEquipment = result;
              this.company.equipment = '';
              for (let ce of this.companiesEquipment) {
                if (this.company.equipment == '') {
                  this.company.equipment += ce.name;
                } else {
                  this.company.equipment += ', ' + ce.name;
                }
              }
            } else {
              this.companiesEquipment = [result];
            }
            this.service.getCompaniesAdministrators(this.company).subscribe({
              next: (result: number | number[]) => {
                if (Array.isArray(result)) {
                  this.administratorIds = result;
                } else {
                  this.administratorIds = [result];
                }
                // dobavljanje
                this.service.getAvailableEquipmentQuantity(this.id).subscribe({
                  next: (result: AvailableEquipmentQuantity[]) => {
                    this.availableEquipmentQuantity = result;
                  },
                });
              },
            });
          },
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

  onDeleteClicked(company: Company): void {
    if (company.id) {
      this.service.deleteCompany(company.id).subscribe({
        next: () => {
          this.getCompanies();
        },
      });
    }
  }

  selectedQuantities: number[] = []; // Array to track selected quantities

  addEquipmentToAppointment(eq: Equipment, quantity: number): void {
    if (quantity > 0) {
      if (!this.selectedEquipment.includes(eq)) {
        this.selectedEquipment.push(eq);

        if (eq.id !== undefined) {
          const equipmentQuantity: EquipmentQuantity = {
            equipmentId: eq.id,
            quantity: quantity,
          };
          // Add to the list of EquipmentQuantity
          this.addEquipmentQuantity(equipmentQuantity);
        }
      }
    }
  }

  removeEquipmnet(index: number): void {
    const removedEquipment = this.selectedEquipment.splice(index, 1)[0];
    // Remove from the list of EquipmentQuantity
    if (removedEquipment.id !== undefined) {
      // Remove from the list of EquipmentQuantity
      this.removeEquipmentQuantity(removedEquipment.id);
    }
  }

  equipmentQuantities: EquipmentQuantity[] = [];

  private addEquipmentQuantity(equipmentQuantity: EquipmentQuantity): void {
    const existingIndex = this.equipmentQuantities.findIndex(
      (eq) => eq.equipmentId === equipmentQuantity.equipmentId
    );

    if (existingIndex !== -1) {
      // Update existing quantity
      this.equipmentQuantities[existingIndex].quantity =
        equipmentQuantity.quantity;
    } else {
      // Add new equipment quantity
      this.equipmentQuantities.push(equipmentQuantity);
    }
  }

  private removeEquipmentQuantity(equipmentId: number): void {
    const indexToRemove = this.equipmentQuantities.findIndex(
      (eq) => eq.equipmentId === equipmentId
    );

    if (indexToRemove !== -1) {
      // Remove equipment quantity
      this.equipmentQuantities.splice(indexToRemove, 1);
    }
  }

  getPredefidedAppointments(id: number): void {
    if (id !== undefined) {
      this.service.getCompanysPredefinedAppointments(id).subscribe({
        next: (result: Appointment | Appointment[]) => {
          if (Array.isArray(result)) {
            this.predefinedAppointments = result;
          } else {
            this.predefinedAppointments = [result];
          }
        },
      });
    }
  }

  changeExc(): void {
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
      const localDate = new Date(
        this.selectedDate.getTime() -
          this.selectedDate.getTimezoneOffset() * 60000
      );
      const formattedDate = localDate
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '); // Implement formatDate as needed
      const dateForWorkingHours = localDate
        .toISOString()
        .slice(0, 10)
        .replace('T', ' ');
      const startTime = dateForWorkingHours + ' 08:00:00'; // Set the start time PROMENTII KAD SE IMPLEMENTIRA RADNO VREME KOMPANIEJ
      const endTime = dateForWorkingHours + ' 16:00:00'; // Set the end time PROMENTII KAD SE IMPLEMENTIRA RADNO VREME KOMPANIEJ

      this.service
        .getFreeTimeSlots(companyId, formattedDate, startTime, endTime)
        .subscribe({
          next: (freeTimeSlots: any) => {
            // Handle the freeTimeSlots data and update your UI as needed
            this.timeSlots = freeTimeSlots;
          },
          error: (error) => {
            console.error('Error fetching free time slots:', error);
          },
        });
    }
  }

  scheduleAppointment(timeSlot: any): void {
    //sad zovemo metode za cuvanje appointmenta
    //kad se sacuva appointment

    if (this.company.id !== undefined) {
      this.service
        .findAdminIdsForAppointmentsAtPickupTime(this.company.id, timeSlot)
        .subscribe({
          next: (result: any) => {
            // Handle the freeTimeSlots data and update your UI as needed
            const adminIdsWithAppointments = result; // Assuming result is an array of admin IDs with appointments
            const adminIdsWithoutAppointments = this.administratorIds.filter(
              (adminId) => !adminIdsWithAppointments.includes(adminId)
            );

            if (adminIdsWithoutAppointments.length > 0) {
              const firstAdminIdWithoutAppointment =
                adminIdsWithoutAppointments[0];
              if (this.company.id !== undefined) {
                const localDate = new Date(
                  this.selectedDate.getTime() -
                    this.selectedDate.getTimezoneOffset() * 60000
                );

                const appointment: Appointment = {
                  pickupTime: timeSlot, //URADI KONVERZIJU SA VREMENSKI ZONU
                  duration: 30,
                  status: Status.IN_PROGRESS,
                  type: Type.EXCEPTIONAL,
                  companyId: this.company.id,
                  userId: this.user?.id,
                  administratorId: firstAdminIdWithoutAppointment,
                };

                console.log(appointment);

                this.service.addAppointment(appointment).subscribe({
                  next: (result: Appointment) => {
                    // Handle the freeTimeSlots data and update your UI as needed
                    for (let eq of this.equipmentQuantities) {
                      // Set the appointmentId for each object in the list
                      eq.appointmentId = result.id;
                    }

                    this.service
                      .addAppointmentEquipment(this.equipmentQuantities)
                      .subscribe({
                        next: (result) => {
                          // Handle the freeTimeSlots data and update your UI as needed
                          console.log('RADIiiiiiiii'); //POSALJI QR KOD
                          alert('You have made an appointment');
                        },
                        error: (error) => {
                          console.error(
                            'Error fetching free time slots:',
                            error
                          );
                        },
                      });
                  },
                  error: (error) => {
                    console.error('Error fetching free time slots:', error);
                  },
                });
              }
            }
          },
          error: (error) => {
            console.error(
              'Error available admin ids for free time slots:',
              error
            );
          },
        });
    }
  }

  schedulePredefinedAppointment(appointmentId: number): void {
    //first schedule the appointments
    this.service
      .schedulePredefinedAppointment(this.user?.id || 0, appointmentId)
      .subscribe({
        next: (result: any) => {
          // add equipment quantities
          for (let eq of this.equipmentQuantities) {
            // Set the appointmentId for each object in the list
            eq.appointmentId = result.id;
          }

          this.service
            .addAppointmentEquipment(this.equipmentQuantities)
            .subscribe({
              next: (result) => {
                // Handle the freeTimeSlots data and update your UI as needed
                console.log('RADIiiiiiiii'); //POSALJI QR KOD
                alert('You have made an appointment');
                //ponovno dobavljanje predefinisanih termina
                this.getPredefidedAppointments(this.id);
              },
              error: (error) => {
                console.error('Error adding equipment to appointment:', error);
              },
            });
        },
      });
  }

  getAvailableQuantity(equipmentId: number): number {
    let equipmentQuantity = this.availableEquipmentQuantity.find(
      (aq) => aq.equipmentId === equipmentId
    );

    if (equipmentQuantity) {
      return equipmentQuantity.availableQuantity;
    } else {
      return 0;
    }
  }
}
