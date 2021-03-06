import { Component, OnInit, AfterViewInit, Injectable, Input, SimpleChanges } from '@angular/core';

import * as ol from 'openlayers';
import * as fs from 'file-saver';


import { DataConService } from '../services/data-con.service';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';
import { MatSnackBar } from '@angular/material';
import { Ligne } from '../Model/ligne';
import { Arret } from '../Model/arret';
import { Observable } from 'rxjs/Observable';
import { coordinate } from 'openlayers';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.scss']
})


export class OlmapComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataConService, public gestionLigneArret: GestionLigneArret, public snackBar: MatSnackBar) {
    this.linesVisible = true;
    this.stopsVisible = true;
  }

  private geoServerHost: String = '10.205.8.226:4601';
  private geoServerWmsUrl: string = 'http://' + this.geoServerHost + '/geoserver/osm/wms';
  private map: ol.Map;
  private zoom;

  private mapLayers;

  //Fonds de carte
  //-OpenStreetMaps
  private osmWorldMapLayers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  //-ArcGIS
  private arcGisWorldMapLayers = [new ol.layer.Tile({
    source: new ol.source.XYZ({
      attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
        'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'anonymous'
    })
  })];
  //-Stamen water color
  private stamenWaterColor = [new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'watercolor'
    })
  })];
  //- Stamen terrain
  private stamenTerrain = [new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'terrain'
    })
  })];
  //- Stamen Toner
  private stamenTonerLite = [new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'toner-lite'
    })
  })];

  //Listes des arrets et lignes visibles
  visibleLines: Array<Ligne> = Array<Ligne>();
  visibleStops: Array<Arret> = Array<Arret>();

  //Boutons d'affichage de lignes activés ou désactivés
  linesVisible: Boolean = true;
  stopsVisible: Boolean = true;
  mapVisible: Boolean = true;

  //Pas du magnétoscope
  navType: string;

  //Limites de la carte (Ville de tours)
  projection = new ol.proj.Projection({
     code: 'EPSG:3857',
     extent: [55000, 5980000, 100000, 6020000],
     units: 'm'
   });


  mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  jh=["Lundi_0","Lundi_1","Lundi_2","Lundi_3","Lundi_4","Lundi_5","Lundi_6","Lundi_7","Lundi_8","Lundi_9","Lundi_10","Lundi_11","Lundi_12","Lundi_13","Lundi_14","Lundi_15","Lundi_16","Lundi_17","Lundi_18","Lundi_19","Lundi_20","Lundi_21","Lundi_22","Lundi_23","Mardi_0","Mardi_1","Mardi_2","Mardi_3","Mardi_4","Mardi_5","Mardi_6","Mardi_7","Mardi_8","Mardi_9","Mardi_10","Mardi_11","Mardi_12","Mardi_13","Mardi_14","Mardi_15","Mardi_16","Mardi_17","Mardi_18","Mardi_19","Mardi_20","Mardi_21","Mardi_22","Mardi_23","Mercredi_0","Mercredi_1","Mercredi_2","Mercredi_3","Mercredi_4","Mercredi_5","Mercredi_6","Mercredi_7","Mercredi_8","Mercredi_9","Mercredi_10","Mercredi_11","Mercredi_12","Mercredi_13","Mercredi_14","Mercredi_15","Mercredi_16","Mercredi_17","Mercredi_18","Mercredi_19","Mercredi_20","Mercredi_21","Mercredi_22","Mercredi_23","Jeudi_0","Jeudi_1","Jeudi_2","Jeudi_3","Jeudi_4","Jeudi_5","Jeudi_6","Jeudi_7","Jeudi_8","Jeudi_9","Jeudi_10","Jeudi_11","Jeudi_12","Jeudi_13","Jeudi_14","Jeudi_15","Jeudi_16","Jeudi_17","Jeudi_18","Jeudi_19","Jeudi_20","Jeudi_21","Jeudi_22","Jeudi_23","Vendredi_0","Vendredi_1","Vendredi_2","Vendredi_3","Vendredi_4","Vendredi_5","Vendredi_6","Vendredi_7","Vendredi_8","Vendredi_9","Vendredi_10","Vendredi_11","Vendredi_12","Vendredi_13","Vendredi_14","Vendredi_15","Vendredi_16","Vendredi_17","Vendredi_18","Vendredi_19","Vendredi_20","Vendredi_21","Vendredi_22","Vendredi_23","Samedi_0","Samedi_1","Samedi_2","Samedi_3","Samedi_4","Samedi_5","Samedi_6","Samedi_7","Samedi_8","Samedi_9","Samedi_10","Samedi_11","Samedi_12","Samedi_13","Samedi_14","Samedi_15","Samedi_16","Samedi_17","Samedi_18","Samedi_19","Samedi_20","Samedi_21","Samedi_22","Samedi_23","Dimanche_0","Dimanche_1","Dimanche_2","Dimanche_3","Dimanche_4","Dimanche_5","Dimanche_6","Dimanche_7","Dimanche_8","Dimanche_9","Dimanche_10","Dimanche_11","Dimanche_12","Dimanche_13","Dimanche_14","Dimanche_15","Dimanche_16","Dimanche_17","Dimanche_18","Dimanche_19","Dimanche_20","Dimanche_21","Dimanche_22","Dimanche_23"];

  //Données de l'arrêt survolé par le pointeur de la souris
  stopHoveredData:string;

  

  @Input() sliderValue = 1;

  ngOnInit() {
    this.gestionLigneArret.getIntObs().subscribe(val =>{
      this.stopHoveredData=val;
      console.log(val);
    });
    this.gestionLigneArret.getArretsSetOBS().subscribe(l => {
      if((l === 'jour') || (l === 'mois') || (l === 'heure') || (l === 'jourHeure')){
        this.navType = l
      }
    });
    this.gestionLigneArret.fetchDataObs.subscribe(tFiltre => {
      this.removeAllLineStopLayers();

      if((tFiltre === "persLinesSelectedLinesStops") || (tFiltre === "persLinesPersStops") || (tFiltre === "persLinesAllStops") || (tFiltre === "allLinesPersStops") || (tFiltre === "allLinesAllStops")){
        this.gestionLigneArret.getSelectedLines().forEach(ligne => {
          this.showLine(ligne);
        });
        this.gestionLigneArret.getSelectedStops().forEach(stop => {
          this.showStop(stop);
        });
      }

    });

  }

  //Enlever tous les arrets et lignes de la carte
  removeAllLineStopLayers() {
    this.visibleLines.forEach(element => {
      this.map.removeLayer(element.getGeo());
      this.map.removeInteraction(element.getHoverInteraction());
    });
    this.visibleLines = new Array<Ligne>();
    this.visibleStops.forEach(arret => {
      this.map.removeLayer(arret.getGeo());
      this.map.removeInteraction(arret.getHoverInteraction());
      this.map.removeInteraction(arret.getDataHoverInteraction());
    });
    this.visibleStops = new Array<Arret>();
  }

  ngAfterViewInit() {

    //Polygones fond de carte local
    var polygon = this.fetchMapLayer('osm:planet_osm_polygon', 3857, '');

    //Routes fond de carte local
    var roads = this.fetchMapLayer('osm:planet_osm_roads', 3857, '');

    //Lignes fond de carte local
    var lines = this.fetchMapLayer('osm:planet_osm_line', 3857, '');

    //Points Fond de carte local
    var points = this.fetchMapLayer('osm:planet_osm_point', 3857, '');

    this.mapLayers = [/*polygon, */roads, lines/*, points*/];
    //this.map = this.newOlMap(this.mapLayers, 'map'); 
    //this.map = this.newOlMap(this.osmWorldMapLayers, 'map');
    this.map = this.newOlMap(this.arcGisWorldMapLayers, 'map');
    //this.map = this.newOlMap(this.stamenWaterColor, 'map');
    //this.map = this.newOlMap(this.stamenTerrain, 'map');
    //this.map = this.newOlMap(this.stamenTonerLite, 'map');

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sliderValue']) {
      try {
        if (this.navType === 'mois') {
          this.magnetoFwdMonth(this.mois[this.sliderValue]);
        }
        if (this.navType === 'jour') {
          this.magnetoFwdDay(this.jours[this.sliderValue]);
        }
        if (this.navType === 'heure') {
          this.magnetoFwdHour(this.sliderValue.toString());
        }
        if (this.navType === 'jourHeure') {
          this.magnetoFwdDayHour(this.jh[this.sliderValue]);
        }

      } catch { }
    }
  }

  getLibSlider() {
    if (this.navType === 'mois') {
      return this.mois[this.sliderValue]
    }
    if (this.navType === 'jour') {
      return this.jours[this.sliderValue];
    }
    if (this.navType === 'heure') {
      return this.sliderValue + 'h';
    }
    if (this.navType === 'jourHeure') {
      if(this.sliderValue>-1){
        var param = this.jh[this.sliderValue].split('_',2);
        var jour = param[0];
        var heure = param[1];
        return jour+' à '+heure+'h';
      } else return '';
    }
  }

  newOlMap(layers, target: string): ol.Map {
    return new ol.Map({
      target: target,
      layers: layers,
      view: new ol.View({
        extent: this.projection.getExtent(),
        center: ol.proj.fromLonLat([0.68, 47.38]),
        minZoom: 10,
        zoom: 12,
        
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

  showLine(ligne: Ligne) {
    if (ligne === undefined || ligne === null) {
      this.snackBar.open('Selectionnez une ligne', null, { duration: 2000 });
    } else {
      try {
        if (!this.linesVisible) {
          ligne.getGeo().setVisible(false);
        }
        this.map.addLayer(ligne.getGeo());
        this.map.addInteraction(ligne.getHoverInteraction());
      } catch (e) {
        ligne.highlight(5, 150);
        console.log(e);
      }
      this.visibleLines.push(ligne);
    }
  }

  showStop(arret: Arret) {
    if (!this.stopsVisible) {
      arret.getGeo().setVisible(false);
    }
    this.map.addLayer(arret.getGeo());
    this.visibleStops.push(arret);
    this.map.addInteraction(arret.getHoverInteraction());
  }

  magnetoFwdMonth(mois: string) {
    this.visibleStops.forEach(arret => {
      this.map.removeInteraction(arret.getDataHoverInteraction());
      this.map.removeInteraction(arret.getHoverInteraction());
      arret.setMonthDataHoveredStyle(mois,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      arret.setMonthDataStyle(mois,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      this.map.addInteraction(arret.getDataHoverInteraction());
    });
  }

  magnetoFwdDay(jour: string) {
    this.visibleStops.forEach(arret => {
      this.map.removeInteraction(arret.getDataHoverInteraction());
      this.map.removeInteraction(arret.getHoverInteraction());
      arret.setDayDataHoveredStyle(jour,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      arret.setDayDataStyle(jour,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      this.map.addInteraction(arret.getDataHoverInteraction());
    });
  }

  magnetoFwdHour(heure: string) {
    this.visibleStops.forEach(arret => {
      this.map.removeInteraction(arret.getDataHoverInteraction());
      this.map.removeInteraction(arret.getHoverInteraction());
      arret.setHourDataHoveredStyle(heure,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      arret.setHourDataStyle(heure,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      this.map.addInteraction(arret.getDataHoverInteraction());

      arret.getDataHoverInteraction().on('select', function(evt){
        this.gestionLigneArret.getIntObs().next(arret.getHourData()[heure]);
        //this.stopHoveredData=arret.getHourData()[heure];
      });
      
    });
  }

  magnetoFwdDayHour(jh: string) {
    var param = jh.split('_',2);
    var jour = param[0];
    var heure = param[1];
    this.visibleStops.forEach(arret => {
      this.map.removeInteraction(arret.getDataHoverInteraction());
      this.map.removeInteraction(arret.getHoverInteraction());
      arret.setDayHourDataHoveredStyle(jour,heure,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      arret.setDayHourDataStyle(jour,heure,this.gestionLigneArret.getDataMin(),this.gestionLigneArret.getDataMax());
      this.map.addInteraction(arret.getDataHoverInteraction());
    });
  }

  hideShowLines() {
    if (this.linesVisible) {
      if (!(this.visibleLines.length === 0)) {
        this.visibleLines.forEach(line => {
          line.getGeo().setVisible(false);
        });
      }
      this.linesVisible = false;
    } else {
      if (!(this.visibleLines.length === 0)) {
        this.visibleLines.forEach(line => {
          line.getGeo().setVisible(true);
        });
      }
      this.linesVisible = true;
    }
  }

  hideShowStops() {
    if (this.stopsVisible) {
      if (!(this.visibleStops.length === 0)) {
        this.visibleStops.forEach(stop => {
          stop.getGeo().setVisible(false);
        });
      }
      this.stopsVisible = false;
    } else {
      if (!(this.visibleStops.length === 0)) {
        this.visibleStops.forEach(stop => {
          stop.getGeo().setVisible(true);
        });
      }
      this.stopsVisible = true;
    }
  }

  hideShowMap() {
    if (this.mapVisible) {
      this.osmWorldMapLayers.forEach(element => {
        element.setVisible(false);
      });
      this.arcGisWorldMapLayers.forEach(element => {
        element.setVisible(false);
      });

      this.mapVisible = false;
    } else {
      this.osmWorldMapLayers.forEach(element => {
        element.setVisible(true);
      });
      this.arcGisWorldMapLayers.forEach(element => {
        element.setVisible(true);
      });
      this.mapVisible = true;
    }
  }

  exportToPNG(){
    this.map.once('postcompose', function(event:ol.render.Event) {
      var canvas = event.context.canvas;
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
      } else {
        canvas.toBlob(function(blob) {
          fs.saveAs(blob, 'map.png');
        });
      }
    });
    this.map.renderSync();
  }
}