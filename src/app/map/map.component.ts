import { Component, OnInit, Input,EventEmitter,SimpleChanges } from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() sliderValue:number=0;
  lat: number = 47.383333;
  lng: number = 0.683333;
  ngOnInit(){
    this.lat=this.lat+this.sliderValue*0.001;
    console.log(this.lat);
  }

  countChange(event) {
    this.sliderValue = event;
  }

  updateMap(){
    
  }

  ngOnChanges(changes: SimpleChanges){
    if (changes['sliderValue']){
      this.sliderValue=changes['sliderValue'].currentValue;
      this.lat= 47.383333+this.sliderValue*0.001;
      this.lng = 0.683333+this.sliderValue*0.001;
    }
  }

}
