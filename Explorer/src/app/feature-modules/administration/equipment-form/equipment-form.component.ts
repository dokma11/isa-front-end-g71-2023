import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Equipment } from '../model/equipment.model';
import { AdministrationService } from '../administration.service';
import { CompaniesService } from '../../companies/companies.service';
import { Company } from '../../companies/model/company.model';

@Component({
  selector: 'xp-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.css']
})
export class EquipmentFormComponent implements OnChanges {

  @Output() equimpentUpdated = new EventEmitter<null>();
  @Input() equipment: Equipment;
  @Input() shouldEdit: boolean = false;

  constructor(private service: AdministrationService,
              private companiesService: CompaniesService) {
  }

  ngOnChanges(): void {
    this.equipmentForm.reset();
    if(this.shouldEdit) {
      this.equipmentForm.patchValue(this.equipment);
    }
  }

  equipmentForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    grade: new FormControl(0, [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
  });

  addEquipment(): void {
    const equipment: Equipment = {
      name: this.equipmentForm.value.name || "",
      description: this.equipmentForm.value.description || "",
      type: this.equipmentForm.value.type || "",
      grade: this.equipmentForm.value.grade || 0,
      quantity: this.equipmentForm.value.quantity || 0
    };

    this.companiesService.getCompanyById(-1).subscribe({
      next: (result: Company) => {
          equipment.company = result;

          this.service.addEquipment(equipment).subscribe({
            next: () => { 
              this.equimpentUpdated.emit();
              location.reload(); 
            }
          });
      }
    });
  }

  updateEquipment(): void {
    const equipment: Equipment = {
      name: this.equipmentForm.value.name || "",
      description: this.equipmentForm.value.description || "",
      type: this.equipmentForm.value.type || "",
      grade: this.equipmentForm.value.grade || 0,
      quantity: this.equipmentForm.value.quantity || 0
    };
    equipment.id = this.equipment.id;
    this.service.updateEquipment(equipment).subscribe({
      next: () => { 
        this.equimpentUpdated.emit();
        location.reload();
      }
    });
  }
}
