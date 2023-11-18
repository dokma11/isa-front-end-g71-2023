import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanySearchComponent } from './company-search/company-search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CompanySearchComponent
  ],
  imports: [
    CommonModule, 
    MaterialModule, 
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    CompanySearchComponent
  ]
})
export class CompanyModule { }
