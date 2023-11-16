import { Component } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../companies.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'xp-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent {
    searchTerm: string;
    searchType: string = 'name';  // Default search type
    searchResults: Company[];
    allCompanies: Company[];
    minRating: number;
    maxRating: number;
    constructor(private service: CompaniesService) {}

    ngOnInit(): void {
      this.getCompanies();
    }

    search(): void {
        if (this.searchTerm) {
            this.service.searchCompanies(this.searchTerm, this.searchType).subscribe({
                next:(result: Company | Company[]) => {
                  if (Array.isArray(result)) {
                    this.searchResults = result;
                    let counter = 0;
                    if(this.searchType == "city"){
                      for(let r of this.searchResults){
                        if(!r.address.split(",")[2].includes(this.searchTerm)){
                          this.searchResults.splice(counter,1);
                        }
                        counter++;
                      }
                    }
                    
                  } else {
                    this.searchResults = [result];
                    if(this.searchType == "city"){
                      if(!result.address.split(",")[2].includes(this.searchTerm)){
                        this.searchResults.splice(0,1);
                      }
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
      if (this.minRating !== undefined && this.maxRating !== undefined) {
        this.searchResults = this.searchResults.filter(company => {
          return company.averageGrade >= this.minRating && company.averageGrade <= this.maxRating;
        });
      }
    }

    reset(): void{
      this.getCompanies();
    }

}
