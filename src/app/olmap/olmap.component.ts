import { Component, OnInit, AfterViewInit, Injectable, Input, SimpleChanges } from '@angular/core';

import * as ol from 'openlayers';
import * as jsPDF from 'jspdf';

import { DataConService } from '../services/data-con.service';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';
import { MatSnackBar } from '@angular/material';
import { Ligne } from '../Model/ligne';
import { Arret } from '../Model/arret';
import { Observable } from 'rxjs/Observable';
import { coordinate } from 'openlayers';


@Component({
  selector: 'app-olmap',
  templateUrl: './olmap.component.html',
  styleUrls: ['./olmap.component.scss']
})

//@Injectable()
export class OlmapComponent implements OnInit, AfterViewInit {

  constructor(private dataService: DataConService, public gestionLigneArret: GestionLigneArret, public snackBar: MatSnackBar) {
    //this.lineData = new Array<any>();
    //this.stopLineData = new Array<any>();
    this.ponctualiteData = new Array<any>();
    this.linesVisible = true;
    this.stopsVisible = true;
    this.dataVisible = true;

  }

  private geoServerHost: String = '10.205.8.226:4601';
  private geoServerWmsUrl: string = 'http://' + this.geoServerHost + '/geoserver/osm/wms';
  private map: ol.Map;
  private zoom;

  private mapLayers;
  private osmWorldMapLayers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  private arcGisWorldMapLayers = [new ol.layer.Tile({
    source: new ol.source.XYZ({
      attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
        'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
        'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    })
  })];
  private stamenWaterColor = [new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'watercolor'
    })
  })];

  private stamenTerrain = [new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'terrain'
    })
  })];

  private stamenTonerLite = [new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'toner-lite'
    })
  })];
  //private lignes: Array<ol.layer.Vector> = [null];

  //private lineData;
  //private stopLineData;
  //private hoverInteraction = [null];
  //private pointHoverInteraction = [null];
  //private hoveredLine: string;

  //private lineDbid;
  //private lineSens;

  //private stops: Array<ol.layer.Vector> = [null];

  listeLignes = this.gestionLigneArret.getLignes();
  loading: Observable<Boolean>;
  loadingState;
  selectedLine: Ligne;
  visibleLines: Array<Ligne> = Array<Ligne>();
  visibleStops: Array<Arret> = Array<Arret>();

  linesVisible: Boolean = true;
  stopsVisible: Boolean = true;
  dataVisible: Boolean = true;
  mapVisible: Boolean = true;
  showData = false;

  navType: string;

  ponctualiteData;

  projection = new ol.proj.Projection({
     code: 'EPSG:3857',
     extent: [55000, 5980000, 100000, 6020000],
     units: 'm'
   });


  mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  jh=["Lundi_0","Lundi_1","Lundi_2","Lundi_3","Lundi_4","Lundi_5","Lundi_6","Lundi_7","Lundi_8","Lundi_9","Lundi_10","Lundi_11","Lundi_12","Lundi_13","Lundi_14","Lundi_15","Lundi_16","Lundi_17","Lundi_18","Lundi_19","Lundi_20","Lundi_21","Lundi_22","Lundi_23","Mardi_0","Mardi_1","Mardi_2","Mardi_3","Mardi_4","Mardi_5","Mardi_6","Mardi_7","Mardi_8","Mardi_9","Mardi_10","Mardi_11","Mardi_12","Mardi_13","Mardi_14","Mardi_15","Mardi_16","Mardi_17","Mardi_18","Mardi_19","Mardi_20","Mardi_21","Mardi_22","Mardi_23","Mercredi_0","Mercredi_1","Mercredi_2","Mercredi_3","Mercredi_4","Mercredi_5","Mercredi_6","Mercredi_7","Mercredi_8","Mercredi_9","Mercredi_10","Mercredi_11","Mercredi_12","Mercredi_13","Mercredi_14","Mercredi_15","Mercredi_16","Mercredi_17","Mercredi_18","Mercredi_19","Mercredi_20","Mercredi_21","Mercredi_22","Mercredi_23","Jeudi_0","Jeudi_1","Jeudi_2","Jeudi_3","Jeudi_4","Jeudi_5","Jeudi_6","Jeudi_7","Jeudi_8","Jeudi_9","Jeudi_10","Jeudi_11","Jeudi_12","Jeudi_13","Jeudi_14","Jeudi_15","Jeudi_16","Jeudi_17","Jeudi_18","Jeudi_19","Jeudi_20","Jeudi_21","Jeudi_22","Jeudi_23","Vendredi_0","Vendredi_1","Vendredi_2","Vendredi_3","Vendredi_4","Vendredi_5","Vendredi_6","Vendredi_7","Vendredi_8","Vendredi_9","Vendredi_10","Vendredi_11","Vendredi_12","Vendredi_13","Vendredi_14","Vendredi_15","Vendredi_16","Vendredi_17","Vendredi_18","Vendredi_19","Vendredi_20","Vendredi_21","Vendredi_22","Vendredi_23","Samedi_0","Samedi_1","Samedi_2","Samedi_3","Samedi_4","Samedi_5","Samedi_6","Samedi_7","Samedi_8","Samedi_9","Samedi_10","Samedi_11","Samedi_12","Samedi_13","Samedi_14","Samedi_15","Samedi_16","Samedi_17","Samedi_18","Samedi_19","Samedi_20","Samedi_21","Samedi_22","Samedi_23","Dimanche_0","Dimanche_1","Dimanche_2","Dimanche_3","Dimanche_4","Dimanche_5","Dimanche_6","Dimanche_7","Dimanche_8","Dimanche_9","Dimanche_10","Dimanche_11","Dimanche_12","Dimanche_13","Dimanche_14","Dimanche_15","Dimanche_16","Dimanche_17","Dimanche_18","Dimanche_19","Dimanche_20","Dimanche_21","Dimanche_22","Dimanche_23"];

  @Input() sliderValue = 1;

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
    this.gestionLigneArret.getArretsSetOBS().subscribe(l => {
      if (l === 'jour') {
        this.navType = 'jour';
      }
      if (l === 'mois') {
        this.navType = 'mois';
      }
      if (l === 'heure') {
        this.navType = 'heure';
      }
      if (l === 'jourHeure') {
        this.navType = 'jourHeure';
      }
    });
    this.gestionLigneArret.fetchDataObs.subscribe(tFiltre => {
      this.removeAllLineStopLayers();
      /*
            if (tFiltre === "persLinesSelectedLinesStops") {
              //Lignes personnalisees avec arrets      
              this.gestionLigneArret.getSelectedLines().forEach(ligne => {
                this.showLineWithStops(ligne);
              });
      
            }
      */
      if (tFiltre === "persLinesSelectedLinesStops") {
        //Lignes personnalisees avec arrets      
        this.gestionLigneArret.getSelectedLines().forEach(ligne => {
          this.showLine(ligne);
        });
        this.gestionLigneArret.getSelectedStops().forEach(stop => {
          this.showStop(stop);
        });

      } else if (tFiltre === "persLinesPersStops") {
        //Lignes et arrets personnalises
        this.gestionLigneArret.getSelectedLines().forEach(ligne => {
          this.showLine(ligne);
        });
        this.gestionLigneArret.getSelectedStops().forEach(stop => {
          this.showStop(stop);
        });

      } else if (tFiltre === "persLinesAllStops") {

        this.gestionLigneArret.getSelectedLines().forEach(ligne => {
          this.showLine(ligne);
        });
        this.gestionLigneArret.getSelectedStops().forEach(stop => {
          this.showStop(stop);
        });

      } else if (tFiltre === "allLinesPersStops") {

        this.gestionLigneArret.getSelectedLines().forEach(ligne => {
          this.showLine(ligne);
        });
        this.gestionLigneArret.getSelectedStops().forEach(stop => {
          this.showStop(stop);
        });

      } else if (tFiltre === "allLinesAllStops") {

        this.gestionLigneArret.getSelectedLines().forEach(ligne => {
          this.showLine(ligne);
        });
        this.gestionLigneArret.getSelectedStops().forEach(stop => {
          this.showStop(stop);
        });

      }

    });

  }

  removeAllLineStopLayers() {
    //Remove Lines and Stops from map
    this.visibleLines.forEach(element => {
      this.map.removeLayer(element.getGeo());
      this.map.removeInteraction(element.getHoverInteraction());
    });
    this.visibleLines = new Array<Ligne>();
    this.visibleStops.forEach(arret => {
      this.map.removeLayer(arret.getGeo());
      this.map.removeInteraction(arret.getHoverInteraction());
    });
    this.visibleStops = new Array<Arret>();
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
      //this.sliderValue=changes['sliderValue'].currentValue;
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
        //console.log(this.jh);
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

  showLineWithStops(ligne: Ligne) {
    if (ligne === undefined || ligne === null) {
      this.snackBar.open('Selectionnez une ligne', null, { duration: 2000 });
    } else {
      try {
        if (!this.linesVisible) {
          ligne.getGeo().setVisible(false);
        }
        this.map.addLayer(ligne.getGeo());
        this.map.addInteraction(ligne.getHoverInteraction());

        let color: string = ligne.getStyle().getStroke().getColor().toString();
        ligne.getArrets().forEach(arret => {
          arret.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
              stroke: new ol.style.Stroke({
                color: color,
                width: 5
              }),
              radius: 8,
              fill: new ol.style.Fill({
                color: '#FFFFFF'
              })
            }),
            text: new ol.style.Text({
              //text : arret.getNomCommercial(),
              font: 'Bold 14px  \'lato\''
            })
          }));
          if (!this.stopsVisible) {
            arret.getGeo().setVisible(false);
          }
          this.map.addLayer(arret.getGeo());
          this.visibleStops.push(arret);
          this.map.addInteraction(arret.getHoverInteraction());
        });
      } catch (e) {
        ligne.highlight(5, 150);
        console.log(e);
      }
      this.visibleLines.push(ligne);
    }
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

  /*
    hideSelectedLine() {
      if (this.selectedLine === undefined || this.selectedLine === null) {
        this.snackBar.open('Selectionnez une ligne', null, { duration: 2000 });
      } else {
        try {
      this.map.removeLayer(this.selectedLine.getGeo());
      this.map.removeInteraction(this.selectedLine.getHoverInteraction());
      this.selectedLine.getArrets().forEach(arret => {
        this.map.removeLayer(arret.getGeo());
        this.map.removeInteraction(arret.getHoverInteraction());
        const index: number = this.visibleStops.indexOf(arret);
        this.visibleStops.splice(index, 1);
        this.map.removeInteraction(arret.getHoverInteraction());
      });
   
      const index: number = this.visibleLines.indexOf(this.selectedLine);
      this.visibleLines.splice(index, 1);
   
      } catch (e) {
        this.snackBar.open('Ligne non affichée', null, { duration: 1000 });
        console.log(e);
      }
    }
    }
  */
  showStopData() {
    this.sliderValue = 0;
    this.gestionLigneArret.setFinishedLoading(false);
    console.log(this.genStringArrets());
    this.dataService.getRetardArret(this.genStringArrets())
      .subscribe(data => {
        this.ponctualiteData = data;
        console.log(this.ponctualiteData);
        this.magnetoFwdMonth(this.mois[this.sliderValue]);
        this.gestionLigneArret.setFinishedLoading(true);
      }, err => {
        console.log(err);
      });
  }
  /*
  showStopLineData() {
    
    this.gestionLigneArret.setFinishedLoading(false);  
    this.dataService.getRetardLigneArret(this.selectedLine.getdbId(), '2017')
      .subscribe(data => {
        this.ponctualiteData = data;
        this.gestionLigneArret.setFinishedLoading(true);  
        console.log(this.ponctualiteData);   
      }, err => {
        console.log(err);
      });
  }
  */
  genStringArrets(): string {
    let str = '';
    this.visibleStops.forEach(stop => {
      str = str + stop.getId() + '\\,';
    });
    str = str + '00000000000';
    return str;
  }

  getArretById(id): Arret {
    for (var i = 0; this.visibleStops.length; i++) {
      if (this.visibleStops[i].getId() === id) {
        return this.visibleStops[i];
      }
    }
  }

  //showDataOnMap() {
  /*this.map.getInteractions().clear();
  ol.interaction.defaults().forEach(interaction => {
    this.map.addInteraction(interaction);
  });

  this.visibleStops.forEach(arret => {
    //this.map.removeInteraction(arret.getHoverInteraction()); NOT WORKING ???
    arret.initSizeData();
  });
  this.ponctualiteData['features'].forEach(feature => {
    this.getArretById(feature['properties']['Arret_id']).addSizeData(feature['properties']['Nb_Departs_Retard']);
  });*/
  //this.magnetoFwd(this.mois[this.sliderValue]);
  /*this.visibleStops.forEach(arret => {
    //arret.setSizeDataMagneto();
    //arret.initDataHoveredStyle();
    

    this.map.addInteraction(arret.getDataHoverInteraction());
  });*/
  //this.gestionLigneArret.setFinishedLoading(true);
  //}

  magnetoFwdMonth(mois: string) {
    this.map.getInteractions().clear();
    ol.interaction.defaults().forEach(interaction => {
      this.map.addInteraction(interaction);
    });
    /*
    this.visibleStops.forEach(arret => {
      arret.initSizeData();
    });

    this.ponctualiteData['features'].forEach(feature => {
      if (feature['properties']['Libelle_Mois'] === mois) {
        this.getArretById(feature['properties']['Arret_id']).addSizeData(feature['properties']['Nb_Departs_Retard']);
      }
    });*/

    this.visibleStops.forEach(arret => {
      //arret.setSizeDataMagneto();
      //arret.initDataHoveredStyle();
      arret.setMonthDataHoveredStyle(mois);
      arret.setMonthDataStyle(mois);
      //console.log(arret.getMonthData());
      this.map.addInteraction(arret.getDataHoverInteraction());
    });
  }

  magnetoFwdDay(jour: string) {
    this.map.getInteractions().clear();
    ol.interaction.defaults().forEach(interaction => {
      this.map.addInteraction(interaction);
    });
    this.visibleStops.forEach(arret => {
      arret.setDayDataHoveredStyle(jour);
      arret.setDayDataStyle(jour);
      this.map.addInteraction(arret.getDataHoverInteraction());
    });
  }

  magnetoFwdHour(heure: string) {
    this.map.getInteractions().clear();
    ol.interaction.defaults().forEach(interaction => {
      this.map.addInteraction(interaction);
    });
    this.visibleStops.forEach(arret => {
      arret.setHourDataHoveredStyle(heure);
      arret.setHourDataStyle(heure);
      this.map.addInteraction(arret.getDataHoverInteraction());
    });
  }

  magnetoFwdDayHour(jh: string) {
    var param = jh.split('_',2);
    var jour = param[0];
    var heure = param[1];
    this.map.getInteractions().clear();
    ol.interaction.defaults().forEach(interaction => {
      this.map.addInteraction(interaction);
    });
    this.visibleStops.forEach(arret => {
      arret.setDayHourDataHoveredStyle(jour,heure);
      arret.setDayHourDataStyle(jour,heure);
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


  exportToPDF() {

    var loading = 0;
    var loaded = 0;

    document.body.style.cursor = 'progress';

    var format = 'a4';
    var resolution = 72;
    var dim = [297, 210];
    var width = Math.round(dim[0] * resolution / 25.4);
    var height = Math.round(dim[1] * resolution / 25.4);
    var size = /** @type {ol.Size} */ (this.map.getSize());
    var extent = this.map.getView().calculateExtent(size);

    var source = this.osmWorldMapLayers[0].getSource();

    var tileLoadStart = function () {
      ++loading;
    };

    var tileLoadEnd = function () {
      ++loaded;
      if (loading === loaded) {
        var canvas = this;
        window.setTimeout(function () {
          loading = 0;
          loaded = 0;
          var data = canvas.toDataURL('image/png');
          var pdf = new jsPDF('landscape', undefined, format);
          pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
          pdf.save('map.pdf');
          source.un('tileloadstart', tileLoadStart);
          source.un('tileloadend', tileLoadEnd, canvas);
          source.un('tileloaderror', tileLoadEnd, canvas);
          this.map.setSize(size);
          this.map.getView().fit(extent);
          this.map.renderSync();
          document.body.style.cursor = 'auto';
        }, 100);
      }
    };

    this.map.once('postcompose', function (event) {
      source.on('tileloadstart', tileLoadStart);
      //source.on('tileloadend', tileLoadEnd, event.context.canvas);
      //source.on('tileloaderror', tileLoadEnd, event.context.canvas);
    });

    this.map.setSize([width, height]);
    this.map.getView().fit(extent);
    this.map.renderSync();
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