import { Component, OnInit } from '@angular/core';
import { Company } from '../model/company.model';
import { CompaniesService } from '../companies.service';
import { Equipment } from '../../administration/model/equipment.model';
import { MatDialog } from "@angular/material/dialog";
import { CompanyAdmin } from '../../administration/model/company-admin.model';
import { DatePipe } from '@angular/common'; 
import { EquipmentFormComponent } from '../../administration/equipment-form/equipment-form.component';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { EquipmentQuantity } from '../model/equipmentQuantity.model';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { CompanyFormComponent } from '../company-form/company-form/company-form.component';

@Component({
  selector: 'xp-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit{

  user: User | undefined;

  company: Company = {
    name: "",
    address: "",
    longitude: 0.0,
    latitude: 0.0,
    description: "",
    averageGrade: 0.0,
  };
  selectedCompany: Company;
  shouldEdit: boolean = false;
  shouldRenderCompaniesForm: boolean = false;

  sEquipment: Equipment;
  selectedEquipment: Equipment[] = [];
  equipment: Equipment;
  companiesEquipment: Equipment[] = [];
  shouldRenderEquipmentForm: boolean = false;

  administrators: CompanyAdmin[] = [];

  public map!: Map;
  
  quantites: EquipmentQuantity[] = [];
  removableQuantites: EquipmentQuantity[] = [];

  private dialogRef: any;

  constructor(private service: CompaniesService, 
              public dialog: MatDialog,
              private datePipe: DatePipe,
              private authService: AuthService) { } 

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getAdminById(this.user.id).subscribe({
        next: (result: CompanyAdmin) => {
          if(result){
            this.getCompanies(result.company?.id!);
          }
        },
        error: (err) => {
          console.error('Error fetching companies:', err);
        },
      });
    });    
  }

  getCompanies(id: number): void{
    this.service.getCompanyById(id).subscribe({
      next: (result: Company) => {
          this.company = result;
          this.service.getCompaniesEquipment(this.company).subscribe({
              next: (result: Equipment | Equipment[]) =>{
                if (Array.isArray(result)) {
                  this.companiesEquipment = result;
                }
                else{
                  this.companiesEquipment = [result];
                }
              }
            });

          this.service.getCompaniesAdministrators(this.company).subscribe({
            next: (result: CompanyAdmin | CompanyAdmin[]) =>{
              if (Array.isArray(result)) {
                this.administrators = result;
              }
              else{
                this.administrators = [result];
              }
            }
          });

          this.map = new Map({
            target: 'hotel_map',
            layers: [
              new TileLayer({
                source: new OSM()
              })
            ],
            view: new View({
              center: olProj.fromLonLat([this.company.longitude, this.company.latitude]),
              zoom: 17
            })
          });

          const point = new Point(fromLonLat([this.company.longitude, this.company.latitude]));

          const startMarker = new Feature(point);

          const markerStyle = new Style({
              image: new Icon({
                  anchor: [0.5, 1],
                  src: 'http://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-HD-180x180.png',
                  scale: 0.4
              })
          });

          startMarker.setStyle(markerStyle);

          const vectorLayer = new VectorLayer({
              source: new VectorSource({
                  features: [startMarker]
              })
          });

          this.map.addLayer(vectorLayer);
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }

  onEditClicked(company: Company): void {
    this.dialogRef = this.dialog.open(CompanyFormComponent, {
      data: company,
    });
  }

  onDeleteEquipmentClicked(equipment: Equipment): void{
    if(equipment.id){
      this.service.getIfRemovable(equipment.id).subscribe({
        next: (result: EquipmentQuantity[] | EquipmentQuantity) => {
          if (Array.isArray(result)) {
            this.removableQuantites = result;

            if(this.removableQuantites.length == 0 && equipment.id){
              this.service.deleteEquipment(equipment.id).subscribe({
                next: () => {
                  this.getCompanies(equipment?.company?.id!);
                  location.reload();
                }
              });
            }
            else{
              alert("Can not remove cause there are appointments that need the selected equipment!")
            }
          }
          else{
            this.quantites = [result];
          }
        }          
      });
      
    }
  }

  onAddEquipmentClicked(): void{
    this.dialogRef = this.dialog.open(EquipmentFormComponent, {
      data: {
        shouldEdit: false
      }
    });
  }

  onEditEquipmentClicked(equipment: Equipment): void{
    this.dialogRef = this.dialog.open(EquipmentFormComponent, {
      data: { 
        equipment: equipment,
        shouldEdit: true
      }
    });
  } 

  getEquipment(): void{

  }


  addEquipment(eq: Equipment):void{
      if(!this.selectedEquipment.includes(eq)){
        this.selectedEquipment.push(eq);
      }
      
  }

  removeEquipmnet(index: number): void {
      this.selectedEquipment.splice(index, 1);
  }  
}
