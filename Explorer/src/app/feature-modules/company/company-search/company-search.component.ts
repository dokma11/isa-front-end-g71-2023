import { Component } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../company.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'xp-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent {
     // Default search type
    searchResults: Company[];
    allCompanies: Company[];

    constructor(private service: CompaniesService) {}

    ngOnInit(): void {
      this.getCompanies();
      this.searchForm.reset();
    }


    searchForm = new FormGroup({
      searchName: new FormControl('', [Validators.required]),
      searchCity: new FormControl('', [Validators.required]),
      minRating: new FormControl('', [Validators.required]),
      maxRating: new FormControl('', [Validators.required]),
    });


    search(): void {
      const formValue = this.searchForm.value;
      const searchName = formValue.searchName;
      const searchCity = formValue.searchCity;
        if (searchName && searchCity) {
            this.service.searchCompanies(searchName, searchCity).subscribe({
                next:(result: Company | Company[]) => {
                  if (Array.isArray(result)) {
                    this.searchResults = result;
                    let counter = 0;
                    for(let r of this.searchResults){
                      if (!r.address.split(",")[2].toLowerCase().includes(searchCity.toLowerCase())) {
                        this.searchResults.splice(counter, 1);
                      }
                      counter++;
                    }
                  } else {
                    this.searchResults = [result];
                    if(!result.address.split(",")[2].includes(searchCity.toLowerCase())){
                      this.searchResults.splice(0,1);
                    }
                  }
                },
                error: () => {
                }
            });
        }
    }

    getCompanies(): void {
      this.service.getCompanies().subscribe({
        next: (result: Company | Company[]) => {
          if (Array.isArray(result)) {
            this.searchResults = result;
            this.allCompanies = result;
          } else {
            this.searchResults = [result];
            this.allCompanies = [result];
          }
        },
        error: () => {
        }
      })
    }

    filterByRating(): void {
      const formValue = this.searchForm.value;
      const minRating = formValue.minRating;
      const maxRating = formValue.maxRating;

      if(maxRating && minRating){
        const intMaxRating = parseInt(maxRating, 10);
        const intMinRating = parseInt(minRating, 10);
      
      if (minRating !== undefined && maxRating !== undefined) {
        this.searchResults = this.searchResults.filter(company => {
          return company.averageGrade >= intMinRating && company.averageGrade <= intMaxRating;
        });
      }
    }
    }

    reset(): void{
      this.getCompanies();
    }

}
