import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyComponent } from './company/company.component';
import { MatIconModule } from '@angular/material/icon';
import { CompanyFormComponent } from './company-form/company-form/company-form.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    CompanyComponent,
    CompanyFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule,
    RouterModule,
    SharedModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule
  ],
  exports: [
    CompanyComponent,
    CompanyFormComponent
  ]
})
export class CompaniesModule { }
