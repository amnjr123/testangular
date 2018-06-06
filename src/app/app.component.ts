import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injector, Inject } from '@angular/core';
import { GestionLigneArret } from './Model/gestion-ligne-arret.service';

import * as ol from 'openlayers';
import { DataConService } from './services/data-con.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Test Sgi';
  
  map;
  private osmWorldMapLayers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  //public sv: number =0;
  //gestionLigneArret:GestionLigneArret = new GestionLigneArret(null);

  constructor(){
  }

  ngOnInit() {

  }
  
  sliderValueChanged(newValue: number){
    //this.sv=newValue;
    console.log("new value = "+newValue);
  }
/*

  /////TESTTEST

  ngAfterViewInit() {
    this.map = this.newOlMap(this.osmWorldMapLayers, 'map1');
    this.map.add(this.gestionLigneArret.getFirstLigne().getGeo);
  }

  newOlMap(layers, target: string) {
    return new ol.Map({
      target: target,
      layers: layers,
      view: new ol.View({
        center: ol.proj.fromLonLat([0.68, 47.38]),
        zoom: 12
      })
    });
  }
*/

}
