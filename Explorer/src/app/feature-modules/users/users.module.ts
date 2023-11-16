import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegistrationComponent } from './registration/registration.component';
import { UserUpdateComponent } from './user-update/user-update.component';

@NgModule({
  declarations: [RegistrationComponent, UserRegistrationComponent, UserUpdateComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    FormsModule,
  ],
  exports: [UserRegistrationComponent, RegistrationComponent],
})
export class UsersModule {}
