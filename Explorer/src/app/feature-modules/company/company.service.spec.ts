import { TestBed } from '@angular/core/testing';

import { CompaniesService } from './company.service';

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
