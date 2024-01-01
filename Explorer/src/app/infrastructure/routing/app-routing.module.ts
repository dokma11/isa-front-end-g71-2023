import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/feature-modules/layout/home/home.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegistrationComponent } from '../auth/registration/registration.component';
import { CompanyComponent } from 'src/app/feature-modules/companies/company/company.component';
import { CompanyAdminComponent } from 'src/app/feature-modules/administration/company-admin/company-admin/company-admin.component';
import { EquipmentComponent } from 'src/app/feature-modules/administration/equipment/equipment.component';
import { AuthGuard } from '../auth/auth.guard';
//import { RegistrationComponent } from '../auth/registration/registration.component';
import { CompanySearchComponent } from 'src/app/feature-modules/company/company-search/company-search.component';
import { UserUpdateComponent } from 'src/app/feature-modules/users/user-update/user-update.component';
import { UserRegistrationComponent } from 'src/app/feature-modules/users/user-registration/user-registration.component';
import { CompanyUserViewComponent } from 'src/app/feature-modules/companies/company-user-view/company-user-view.component';
import { AppointmentsComponent } from 'src/app/feature-modules/companies/appointments/appointments.component';
import { CompanyAppointmentsComponent } from 'src/app/feature-modules/companies/company-appointments/company-appointments.component';

const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'register', 
    component: UserRegistrationComponent 
  },
  {
    path: 'equipment',
    component: EquipmentComponent,
    canActivate: [AuthGuard],
  },
  { 
    path: 'searchCompanies', 
    component: CompanySearchComponent 
  },
  { 
    path: 'userProfile', 
    component: UserUpdateComponent 
  },
  { 
    path: 'companies', 
    component: CompanyComponent
  },
  { 
    path: 'company-administrators', 
    component: CompanyAdminComponent
  },
  {
    path: "searchCompanies/company/:id",
    component: CompanyUserViewComponent,
    canActivate: [AuthGuard],
  },
  { 
    path: 'appointments', 
    component: CompanyAppointmentsComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
