import { TestBed } from '@angular/core/testing';

import { CompaniesService } from './companies.service';

describe('CompanyServiceService', () => {
  let service: CompaniesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
