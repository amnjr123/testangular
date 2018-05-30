import { Component, OnInit, AfterViewInit, Injectable } from '@angular/core';

import * as ol from 'openlayers';

import { DataConService } from '../services/data-con.service';

@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.scss']
})

@Injectable()
export class OlmapComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataConService) { }

  geoServerWmsUrl:string='http://localhost:4601/geoserver/osm/wms';
  map: ol.Map;

  mapLayers;
  osmWorldMapLayers = [new ol.layer.Tile({source: new ol.source.OSM()})];

  lignes: Array<ol.layer.Tile> = [null];
  selectedLine: number = 1;
  

  lineData;


  ngOnInit() {
    this.getRecords();
  }

  getLineShapes() {
    //Chargement Layers lignes
    var end: boolean = false;
    var i: number = 1;
    var is;
    while (!end) {
      this.lignes.push(this.fetchMapLayer('osm:MSSLines', 3857,"id:" + i));
      //console.log(i);
      if (i >= this.lineData['features'].length) {
        end = true;
      }
      i++;
    }
  }

  ngAfterViewInit() {

    //Polygones fond de carte
    var polygon = this.fetchMapLayer('osm:planet_osm_polygon', 3857,'');
    
    //Routes fond de carte
    var roads = this.fetchMapLayer('osm:planet_osm_roads', 3857,'');

    //Lignes fond de carte
    var lines = this.fetchMapLayer('osm:planet_osm_line', 3857,'');
    
    //Points Fond de carte
    var points = this.fetchMapLayer('osm:planet_osm_point', 3857,'');
  
    //Arrets bus tram
    var stops = this.fetchMapLayer('osm:testSqlView', 4326,'');

    this.mapLayers = [/*polygon, */roads, lines/*, points*/];
    //this.map = this.newOlMap(this.mapLayers,'map');
    this.map = this.newOlMap(this.osmWorldMapLayers,'map');

    for (var j = 1; j < this.lignes.length; j++) {
      this.lignes[j].setVisible(false);
      this.map.addLayer(this.lignes[j]);
    }

  }

  newOlMap(layers,target:string){
    return new ol.Map({
      target: target,
      layers: layers,
      view: new ol.View({
        center: ol.proj.fromLonLat([0.68, 47.38]),
        zoom: 12
      })
    });
  }

  fetchMapLayer(sdLayerName:string, epsg:number, vp:string){
    return new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: this.geoServerWmsUrl,
        params: {
          LAYERS: sdLayerName,
          VIEWPARAMS: vp,
          TILED: true,
        },
        projection: 'EPSG:'+epsg,
        serverType: 'geoserver'
      })
    });
  }

  showSelectedLine() {
    this.lignes[this.selectedLine].setVisible(true);
  }
  hideSelectedLine() {
    this.lignes[this.selectedLine].setVisible(false);
  }

  getRecords() {

    this.dataService.getRecords()
      .subscribe(data => {
        this.lineData = data;
        this.getLineShapes();
      }, err => {
        console.log(err);
      });

  }
}