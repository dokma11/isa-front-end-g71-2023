import {Component, EventEmitter, Inject, Input, OnChanges, Output, ViewChild} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Company } from "../../model/company.model";
import { CompaniesService } from "../../companies.service";
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
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "xp-company-form",
  templateUrl: "./company-form.component.html",
  styleUrls: ["./company-form.component.css"],
})
export class CompanyFormComponent implements OnChanges {
  @Output() companyUpdated = new EventEmitter<null>();
  @Input() company: Company;
  @Input() shouldEdit: boolean = false;

  constructor(private service: CompaniesService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<CompanyFormComponent>) {
                this.company = data;
                this.ngOnChanges();
              }

  selectedOption: string | null;
  newLongitude: number = 0;
  newLatitude: number = 0;
  isAddButtonDisabled: boolean = true;
  isPublicChecked = false;

  public map!: Map;
  mapEnabled: boolean = false;

  ngOnChanges(): void {
      this.companyForm.reset();
          const companyToPatch = {
              name: this.company.name || null,
              description: this.company.description || null,
              address: this.company.address || null,
              longitude: this.company.longitude || null,
              latitude: this.company.latitude || null,
              averageGrade: this.company.averageGrade.toString() || null
          };
          this.companyForm.patchValue(companyToPatch);
  }

  companyForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      averageGrade: new FormControl("", [Validators.required]),
      longitude: new FormControl(0.0, [Validators.required]),
      latitude: new FormControl(0.0, [Validators.required])
  });

  addCompany(): void {
      const company: Company = {
          name: this.companyForm.value.name || "",
          description: this.companyForm.value.description || "",
          address: this.companyForm.value.address || "",
          averageGrade: parseInt(this.companyForm.value.averageGrade || "0") || 0,
          longitude: this.companyForm.value.longitude || 0,
          latitude: this.companyForm.value.latitude || 0,
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
        longitude:this.companyForm.value.longitude || 0,
        latitude: this.companyForm.value.latitude || 0,
      };

      company.id = this.company.id;
      company.workingHoursEnd = this.company.workingHoursEnd;
      company.workingHoursStart = this.company.workingHoursStart;

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

  enableMap(): void{
    this.mapEnabled = true;

    this.map = new Map({
        target: 'hotel_map_dialogue',
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: olProj.fromLonLat([19.831937147853964, 45.24572577637579]),
          zoom: 14
        })
    });

    this.map.on('click', (event: any) => {
        const coordinate = event.coordinate;
    
        const lonLat = olProj.toLonLat(coordinate);
    
        console.log('Longitude:', lonLat[0]);
        console.log('Latitude:', lonLat[1]);

        this.companyForm.value.longitude = lonLat[0];
        this.companyForm.value.latitude = lonLat[1];

        this.map.getLayers().forEach((layer) => {
            if (layer instanceof VectorLayer) {
              this.map.removeLayer(layer);
            }
          });

        const point = new Point(fromLonLat([lonLat[0], lonLat[1]]));

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
    });
  }
}