import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyComponent } from './company/company.component';
import { MatIconModule } from '@angular/material/icon';
import { CompanyFormComponent } from './company-form/company-form/company-form.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AdministrationModule } from '../administration/administration.module';

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyFormComponent,
    AppointmentsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule,
    RouterModule,
    SharedModule,
    AdministrationModule
  ],
  exports: [
    CompanyComponent,
    CompanyFormComponent
  ]
})
export class CompaniesModule { }
