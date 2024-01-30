import { Component } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../company.service';
import { PagedResults } from 'src/app/shared/model/paged-results.model';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';

@Component({
  selector: 'xp-company-search',
  templateUrl: './company-search.component.html',
  styleUrls: ['./company-search.component.css']
})
export class CompanySearchComponent {
     // Default search type
    searchResults: Company[];
    allCompanies: Company[];
    user: User | undefined;

    constructor(private service: CompaniesService, private authService: AuthService) {}

    ngOnInit(): void {
      this.getCompanies();
      this.searchForm.reset();
      this.authService.user$.subscribe(user => {
        this.user = user;
      });
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
        const intMaxRating = parseFloat(maxRating);
        const intMinRating = parseFloat(minRating);
      
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

    seeDetails() : void{
      
    }

    sortBy: string = 'name'; // Default sorting by name
  sortOrder: 'asc' | 'desc' = 'asc'; // Default sorting order

  // Function to toggle sorting order
  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortResults();
  }

  // Function to sort the search results
  sortResults(): void {
    this.searchResults.sort((a, b) => {
      const order = this.sortOrder === 'asc' ? 1 : -1;

      if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name) * order;
      } else if (this.sortBy === 'city') {
        return a.address.split(',')[2].localeCompare(b.address.split(',')[2]) * order;
      } else if (this.sortBy === 'grade') {
        return (a.averageGrade - b.averageGrade) * order;
      }

      return 0; // No sorting if sortBy is not recognized
    });
  }

  // Existing code...

  // Additional method to reset sorting
  resetSorting(): void {
    this.sortBy = 'name';
    this.sortOrder = 'asc';
    this.sortResults();
  }

// Add these methods to your component
sortByName(): void {
  this.sortBy = 'name';
  this.toggleSortOrder();
}

sortByCity(): void {
  this.sortBy = 'city';
  this.toggleSortOrder();
}

sortByGrade(): void {
  this.sortBy = 'grade';
  this.toggleSortOrder();
}

}
