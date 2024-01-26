import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrationComponent } from './registration/registration.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UsersAppointmentsComponent } from './users-appointments/users-appointments.component';
import { AppointmentEquipmentViewComponent } from './appointment-equipment-view/appointment-equipment-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UsersQrcodesComponent } from './users-qrcodes/users-qrcodes.component';
import { UsersAppintmentHistoryComponent } from './users-appintment-history/users-appintment-history.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
@NgModule({
  declarations: [
    RegistrationComponent,
    UserRegistrationComponent,
    UserUpdateComponent,
    UsersAppointmentsComponent,
    AppointmentEquipmentViewComponent,
    UsersQrcodesComponent,
    UsersAppintmentHistoryComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    QRCodeModule,
    MatSortModule,
    MatTableModule
  ],
  exports: [UserRegistrationComponent, RegistrationComponent],
})
export class UsersModule {}
