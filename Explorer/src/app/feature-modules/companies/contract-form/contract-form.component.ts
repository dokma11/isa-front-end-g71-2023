import { Component, EventEmitter, Inject, Input, OnChanges, Output } from '@angular/core';
import { Contract } from '../model/contract.model';
import { CompaniesService } from '../companies.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'xp-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.css']
})
export class ContractFormComponent implements OnChanges{

  @Output() contractUpdated = new EventEmitter<null>();
  @Input() contractInput: Contract;
  @Input() shouldEdit: boolean = true;

  contract: Contract;

  minDate: Date;  

  constructor(private service: CompaniesService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);   

    this.minDate = tomorrow;

    this.contract = data;
    this.ngOnChanges();
  }

  ngOnChanges(): void {
    this.contractForm.reset();
    if(this.shouldEdit) {
      const contractPatch = {
        hospitalName: this.contract.hospitalName || null,
        hospitalAddress: this.contract.hospitalAddress || null,
        companyName: this.contract.companyName || null,
        companyAddress: this.contract.companyAddress || null,
        equipmentName: this.contract.equipmentName || null,
        equipmentQuantity: this.contract.equipmentQuantity || null,
        deliveryDate: this.contract.deliveryDate || null
      };

      this.contractForm.patchValue(contractPatch);
    }
  }

  contractForm = new FormGroup({
    hospitalName: new FormControl('',[Validators.required]),
    hospitalAddress: new FormControl('',[Validators.required]),
    companyName: new FormControl('',[Validators.required]),
    companyAddress: new FormControl('',[Validators.required]),
    equipmentName: new FormControl('',[Validators.required]),
    equipmentQuantity: new FormControl(0,[Validators.required]),
    //deliveryDate: new FormControl(null, [Validators.required]),
  });

  editContract(): void{
    const contract = {
      hospitalName: this.contractForm.value.hospitalName || '',
      hospitalAddress: this.contractForm.value.hospitalAddress || '',
      companyName: this.contractForm.value.companyName || '',
      companyAddress: this.contractForm.value.companyAddress || '',
      equipmentName: this.contractForm.value.equipmentName || '',
      equipmentQuantity: this.contractForm.value.equipmentQuantity || 0,
      deliveryDate: this.contract.deliveryDate || null,
      id: this.contract.id,
      status: this.contract.status
    };

    this.service.updateContract(contract).subscribe({
      next: () => { 
        this.contractUpdated.emit();
        location.reload();
      }
    }); 
  }
}
