import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { MaterialModule } from 'src/app/infrastructure/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyAdminComponent } from './company-admin/company-admin/company-admin.component';
import { CompanyAdminFormComponent } from './company-admin-form/company-admin-form.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthModule } from 'src/app/infrastructure/auth/auth.module';
import { CompanyAdminPasswordFormComponent } from './company-admin-password-form/company-admin-password-form.component';



@NgModule({
  declarations: [
    EquipmentFormComponent,
    EquipmentComponent,
    CompanyAdminComponent,
    CompanyAdminFormComponent,
    CompanyAdminPasswordFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MaterialModule,
    RouterModule,
    SharedModule,
    AuthModule
  ],
  exports: [
    EquipmentComponent,
    EquipmentFormComponent,
    CompanyAdminComponent,
    CompanyAdminFormComponent
  ]
})
export class AdministrationModule { }
