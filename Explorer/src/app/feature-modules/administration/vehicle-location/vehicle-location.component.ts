import { Component, OnInit } from '@angular/core';
import { AdministrationService } from '../administration.service';
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
import { Message } from '../model/message.model';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'xp-vehicle-location',
  templateUrl: './vehicle-location.component.html',
  styleUrls: ['./vehicle-location.component.css']
})
export class VehicleLocationComponent implements OnInit{

  public map!: Map;
  private longitude: number;
  private latitude: number;

  private serverUrl = 'http://localhost:8081/socket'
  private stompClient: any;

  isLoaded: boolean = false;
  isCustomSocketOpened = false;
  messages: Message[] = [];

  constructor(private service: AdministrationService) { } 

  ngOnInit(): void {
   this.service.startSimulator().subscribe(
    (response: string) => {
      console.log('Notification sent successfully:', response);
      // Handle the response if needed
    },
    (error) => {
      console.error('Error sending notification:', error);
      // Handle the error if needed
    }
  );

  this.initializeWebSocketConnection();

    this.map = new Map({
      target: 'hotel_map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([19.807542, 45.270335]),
        zoom: 17
      })
    });
    
    let markerLayer = new VectorLayer; 

    let i = 0;

    if(i < 20){
      setInterval(() => {
        
        const layers = this.map.getLayers();
        const numberOfLayers = layers.getLength();

        console.log('Number of layers:', numberOfLayers);

        if(markerLayer){
          this.map.removeLayer(markerLayer);
        }

        const point = new Point(fromLonLat([this.longitude, this.latitude]));
    
        const startMarker = new Feature(point);
    
        const markerStyle = new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: 'http://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-PNG-HD-180x180.png',
                scale: 0.4
            })
        });
    
        startMarker.setStyle(markerStyle);
    
        markerLayer = new VectorLayer({
            source: new VectorSource({
                features: [startMarker]
            })
        });
    
        this.map.addLayer(markerLayer);
        i++;
        console.log("i = " + i);
    }, 3000);
    
    }
    
  }

  initializeWebSocketConnection() {
    let ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, (frame: any) => {
      console.log('WebSocket connected', frame);
  
      this.stompClient.subscribe('/socket-publisher', (message: any) => {
          console.log('Received message:', message.body);
          this.handleResult(message.body);
      }, (error: any) => {
          console.error('Error during subscription:', error);
      });
    }, (error: any) => {
        console.error('WebSocket connection error:', error);
    });
  }

  handleResult(message: string) {
    console.log(message);
    
    let resultArray: string[] = message.split(',');
    let numberArray: number[] = resultArray.map(Number);

    this.latitude = numberArray[0];
    this.longitude = numberArray[1];
  }
}
