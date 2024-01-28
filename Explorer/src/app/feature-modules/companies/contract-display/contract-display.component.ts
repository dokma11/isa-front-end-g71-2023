import { Component } from '@angular/core';
import { Contract } from '../model/contract.model';
import { CompaniesService } from '../companies.service';
import { MatDialog } from '@angular/material/dialog';
import { ContractFormComponent } from '../contract-form/contract-form.component';

@Component({
  selector: 'xp-contract-display',
  templateUrl: './contract-display.component.html',
  styleUrls: ['./contract-display.component.css']
})
export class ContractDisplayComponent {
  contracts: Contract[] = [];
  private dialogRef: any;

  constructor(private service: CompaniesService,
              public dialog: MatDialog){}

  ngOnInit(){
    this.service.getContracts().subscribe({
      next: (result: Contract[]) => {
        this.contracts = result;
      }
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
