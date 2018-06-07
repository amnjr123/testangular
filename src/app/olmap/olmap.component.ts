import { Component, OnInit, AfterViewInit, Injectable } from '@angular/core';

import * as ol from 'openlayers';

import { DataConService } from '../services/data-con.service';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';
import { MatSnackBar } from '@angular/material';
import { Ligne } from '../Model/ligne';

@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.scss']
})

//@Injectable()
export class OlmapComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataConService, private gestionLigneArret: GestionLigneArret, public snackBar: MatSnackBar) {
    this.lineData = new Array<any>();
    this.stopLineData = new Array<any>();
  }

  private geoServerHost: String = '10.205.8.226:4601';
  private geoServerWmsUrl: string = 'http://' + this.geoServerHost + '/geoserver/osm/wms';
  private map: ol.Map;

  private mapLayers;
  private osmWorldMapLayers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  private lignes: Array<ol.layer.Vector> = [null];

  private lineData;
  private stopLineData;
  private hoverInteraction = [null];
  private pointHoverInteraction = [null];
  private hoveredLine: string;

  private lineDbid;
  private lineSens;

  private stops: Array<ol.layer.Vector> = [null];

  private listeLignes = this.gestionLigneArret.getLignes();
  private selectedLine: Ligne;

  /*
  genWfsUrl(typename: string, maxFeatures: string, viewparams: string) {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typename + '&maxFeatures=' + maxFeatures + '&outputFormat=application%2Fjson&viewparams=' + viewparams;
  }*/
  /*
    lineNameById(id): string {
      var LigneLibelleComplet;
      this.lineData['features'].some(feature => {
        if (feature['properties']['id'] === id) {
          LigneLibelleComplet = feature['properties']['LigneLibelleComplet'];
          return LigneLibelleComplet;
        } else {
          return '';
        }
      });
      return LigneLibelleComplet;
    }
  */
  /*
     genLinePropById(id) {
       this.lineData['features'].some(feature => {
         if (feature['properties']['id'] === id) {
           this.lineDbid = feature['properties']['Ligne_id'];
           this.lineSens = feature['properties']['Ligne_Sens'];
           return;
         }
       });
     }*/
  /*
    getLineRecords() {
      this.dataService.getLineRecords()
        .subscribe(data => {
          this.lineData = data;
          this.getLineShapes();
        }, err => {
          console.log(err);
        });
    }
  *//*
    getStopLineRecords(lineDbId: string, lineDbSensId: number) {
      this.dataService.getStopLineRecords(lineDbId, lineDbSensId)
        .subscribe(data => {
          this.stopLineData = data;
          this.getStopShapes();
          console.log(this.stops);
        }, err => {
          this.stopLineData = null;
          console.log(err);
        });
      return this.stopLineData;
    }
  */
  ngOnInit() {

  }
  /*
    getLineShapes() {
      //Chargement Layers lignes
      this.lineData['features'].forEach(feature => {
        if (feature['properties']['LigneTypeLibelle'] === 'Bus') {
          this.lignes.push(this.fetchmapLineFeature('osm:MSSLines', '1', "id:" + feature['properties']['id'], '#0DB2A6', 5));
        } else if (feature['properties']['LigneTypeLibelle'] === 'Tram') {
          this.lignes.push(this.fetchmapLineFeature('osm:MSSLines', '1', "id:" + feature['properties']['id'], '#CF1111', 7));
        }
      });
    }*/
  /*
    getStopShapes() {
      this.stops=[];
      this.stopLineData['features'].forEach(feature => {
        //console.log(feature['properties']['arret_id']);
        this.stops.push(this.fetchmapStopFeature('osm:geoArret', '1', "Arret_id:" + feature['properties']['arret_id'], '#0DB2A6', 5));
      });
    }
  
    getLineStopShapes(selectedLine) {
      this.genLinePropById(this.selectedLine);
      this.getStopLineRecords(this.lineDbid, this.lineSens);
    }*/
  /*
    showStopsOnMap() {
      console.log(this.stops);
      var first = true;
      var n = -1;
      this.stops.forEach(stop => {
        if (first) first = false;
        else {
          n++;
          this.map.removeLayer(stop);
          this.map.addLayer(stop);
  
          this.pointHoverInteraction[n] = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            style: new ol.style.Style({
              image: new ol.style.Circle({
                stroke: new ol.style.Stroke({
                  color: '#FF8300',
                  width: 10
                }),
                radius: 5
              }),
              text: new ol.style.Text({
                text: 'Arret n° '+n,
                font: 'Bold 18px  \'Calibri\'',
        
              })
            }),
            layers: [stop]
          });
          this.pointHoverInteraction.forEach(element => {
            this.map.addInteraction(element);
          });
  
        }
  
      });
    }
  *//*
    removeStopsFormMap(){
      var first = true;
      var n = -1;
      this.stops.forEach(stop => {
          this.map.removeLayer(stop);
      });
    }
  */
  ngAfterViewInit() {
    //Polygones fond de carte
    var polygon = this.fetchMapLayer('osm:planet_osm_polygon', 3857, '');

    //Routes fond de carte
    var roads = this.fetchMapLayer('osm:planet_osm_roads', 3857, '');

    //Lignes fond de carte
    var lines = this.fetchMapLayer('osm:planet_osm_line', 3857, '');

    //Points Fond de carte
    var points = this.fetchMapLayer('osm:planet_osm_point', 3857, '');

    //Arrets bus tram
    var stops = this.fetchMapLayer('osm:testSqlView', 4326, '');

    this.mapLayers = [/*polygon, */roads, lines/*, points*/];
    //this.map = this.newOlMap(this.mapLayers, 'map');
    this.map = this.newOlMap(this.osmWorldMapLayers, 'map');
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

  fetchMapLayer(sdLayerName: string, epsg: number, vp: string) {
    return new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: this.geoServerWmsUrl,
        params: {
          LAYERS: sdLayerName,
          VIEWPARAMS: vp,
          TILED: true,
        },
        projection: 'EPSG:' + epsg,
        serverType: 'geoserver'
      })
    });
  }

  /*
    fetchmapLineFeature(sdLayerName: string, maxFeatures: string, vp: string, color: string, width: number) {
      var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON,
        url: this.genWfsUrl(sdLayerName, maxFeatures, vp),
        strategy: ol.loadingstrategy.bbox
      });
      var layer = new ol.layer.Vector({
        source: vectorSource,
      });
      var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: color,
          width: width
        })
      })
      layer.setStyle(style);
      return layer;
    }
  
    fetchmapStopFeature(sdLayerName: string, maxFeatures: string, vp: string, color: string, width: number) {
      var vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON,
        url: this.genWfsUrl(sdLayerName, maxFeatures, vp),
        strategy: ol.loadingstrategy.bbox
      });
      var layer = new ol.layer.Vector({
        source: vectorSource,
      });
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          stroke: new ol.style.Stroke({
            color: color,
            width: 10
          }),
          radius: 2
        })
      });
      layer.setStyle(style);
      console.log(layer.getKeys);
      return layer;
    }
  */
  showSelectedLine() {
    if (this.selectedLine === undefined) {
      this.snackBar.open('Selectionnez une ligne', null, { duration: 1000 });
    } else {
      try {
        this.map.addLayer(this.selectedLine.getGeo());
        this.map.addInteraction(this.selectedLine.getHoverInteraction());
        this.selectedLine.highlight(1,2000);
      } catch {
        this.selectedLine.highlight(5,150);
      }
    }
  }

  hideSelectedLine() {
    if (this.selectedLine === undefined) {
      this.snackBar.open('Selectionnez une ligne', null, { duration: 1000 });
    } else {
      try {
        this.map.removeLayer(this.selectedLine.getGeo());
        this.map.removeInteraction(this.selectedLine.getHoverInteraction());
      } catch {
        this.snackBar.open('Ligne non affichée', null, { duration: 1000 });
      }
    }
  }
  /*
    getSelectedLineStyle(lineId) {
      this.hoveredLine = this.lineNameById(lineId);
      console.log(this.hoveredLine);
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#FF8300',
          width: 10,
        }),
        text: new ol.style.Text({
          text: this.hoveredLine,
          font: 'Bold 18px  \'Calibri\'',
        })
      })
  
    }
  */
}