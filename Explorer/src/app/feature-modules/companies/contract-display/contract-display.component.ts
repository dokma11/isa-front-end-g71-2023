import { Component } from '@angular/core';
import { Contract } from '../model/contract.model';
import { CompaniesService } from '../companies.service';
import { MatDialog } from '@angular/material/dialog';
import { ContractFormComponent } from '../contract-form/contract-form.component';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { CompanyAdmin } from '../../administration/model/company-admin.model';

@Component({
  selector: 'xp-contract-display',
  templateUrl: './contract-display.component.html',
  styleUrls: ['./contract-display.component.css']
})
export class ContractDisplayComponent {
  contracts: Contract[] = [];
  private dialogRef: any;
  user: User | undefined;

  constructor(private service: CompaniesService,
              public dialog: MatDialog,
              private authService: AuthService){

              }

  ngOnInit(){
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getAdminById(this.user.id).subscribe({
        next: (result: CompanyAdmin) => {
          if(result){
            this.service.getContracts(result.id!).subscribe({
              next: (result: Contract[]) => {
                this.contracts = result;
              }
            });          }
        },
        error: (err) => {
          console.error('Error fetching companies:', err);
        },
      });
    });
  }

  onCancel(contract: Contract): void{
    contract.status = 1

    const today = new Date();
    const deliveryDate = new Date(contract.deliveryDate);

    const timeDifferenceMs = deliveryDate.getTime() - today.getTime();

    const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

    if (timeDifferenceHours < 24) {
      alert('Can not cancel a delivery that is in less than 24 hours.');
      location.reload();
    } else {
      this.service.updateContract(contract).subscribe({
        next: (result: Contract) => {
          location.reload();
        }
      });
    }
  }

  onEditClicked(contract: Contract): void{
    this.dialogRef = this.dialog.open(ContractFormComponent, {
      data: contract,
    });
  }
}
