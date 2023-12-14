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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { CompanyUserViewComponent } from './company-user-view/company-user-view.component';
@NgModule({
  declarations: [
    CompanyComponent,
    CompanyFormComponent,
    AppointmentsComponent,
    CompanyUserViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule,
    RouterModule,
    SharedModule,
    AdministrationModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  exports: [
    CompanyComponent,
    CompanyFormComponent,
    CompanyUserViewComponent
  ],
  providers: [
    DatePipe
  ]
})
export class CompaniesModule { }
