import {Component, EventEmitter, Input, OnChanges, Output, ViewChild} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Company } from "../../model/company.model";
import { CompaniesService } from "../../companies.service";

@Component({
  selector: "xp-company-form",
  templateUrl: "./company-form.component.html",
  styleUrls: ["./company-form.component.css"],
})
export class CompanyFormComponent implements OnChanges {
  @Output() companyUpdated = new EventEmitter<null>();
  @Input() company: Company;
  @Input() shouldEdit: boolean = false;

  constructor(private service: CompaniesService) {}

  selectedOption: string | null;
  newLongitude: number = 0;
  newLatitude: number = 0;
  isAddButtonDisabled: boolean = true;
  isPublicChecked = false;

  ngOnChanges(): void {
      this.companyForm.reset();
      if (this.shouldEdit) {
          const companyToPatch = {
              name: this.company.name || null,
              description: this.company.description || null,
              address: this.company.address || null,
              longitude: this.company.longitude.toString() || null,
              latitude: this.company.latitude.toString() || null,
              averageGrade: this.company.averageGrade.toString() || null
          };
          this.companyForm.patchValue(companyToPatch);
      }
  }

  companyForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      averageGrade: new FormControl("", [Validators.required]),
      longitude: new FormControl("", [Validators.required]),
      latitude: new FormControl("", [Validators.required])
  });

  addCompany(): void {
      const company: Company = {
          name: this.companyForm.value.name || "",
          description: this.companyForm.value.description || "",
          address: this.companyForm.value.address || "",
          averageGrade: parseInt(this.companyForm.value.averageGrade || "0") || 0,
          longitude:
              parseFloat(this.companyForm.value.longitude || "0") || 0,
          latitude:
              parseFloat(this.companyForm.value.latitude || "0") || 0,
      };

      if (this.newLatitude != 0 && this.newLongitude != 0) {
          company.longitude = this.newLongitude;
          company.latitude = this.newLatitude;

          this.service.addCompany(company).subscribe({
              next: result => {
                  this.companyUpdated.emit();
                  location.reload();
              },
          });
      } else {
          alert("You have to choose the location on the map");
      }
  }

  updateCompany(): void {
      const company: Company = {
        name: this.companyForm.value.name || "",
        description: this.companyForm.value.description || "",
        address: this.companyForm.value.address || "",
        averageGrade: parseInt(this.companyForm.value.averageGrade || "0") || 0,
        longitude:
            parseFloat(this.companyForm.value.longitude || "0") || 0,
        latitude:
            parseFloat(this.companyForm.value.latitude || "0") || 0,
      };

      company.id = this.company.id;

      if (this.newLatitude != 0 && this.newLongitude != 0) {
          company.longitude = this.newLongitude;
          company.latitude = this.newLatitude;
      }

      this.service.updateCompany(company).subscribe({
          next: _ => {
              this.companyUpdated.emit();
              location.reload();
          },
      });
  }
}