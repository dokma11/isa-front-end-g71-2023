import { Component } from '@angular/core';
import { Contract } from '../model/contract.model';
import { CompaniesService } from '../companies.service';

@Component({
  selector: 'xp-contract-display',
  templateUrl: './contract-display.component.html',
  styleUrls: ['./contract-display.component.css']
})
export class ContractDisplayComponent {
  contracts: Contract[] = [];

  constructor(private service: CompaniesService,){}

  ngOnInit(){
    //poziv servisa za dobavljanje svih ugovora
  }

  onCancel(id: number): void{
    //kada se pozove za otkazivanje
  }
}
