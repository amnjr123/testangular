import { Component, OnInit, AfterViewInit, Injectable, Input, SimpleChanges } from '@angular/core';

import * as ol from 'openlayers';
import * as jsPDF from 'jspdf';

import { DataConService } from '../services/data-con.service';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';
import { MatSnackBar } from '@angular/material';
import { Ligne } from '../Model/ligne';
import { Arret } from '../Model/arret';
import { Observable } from 'rxjs/Observable';


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

  ponctualiteData;

  mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

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
    this.gestionLigneArret.fetchDataObs.subscribe(tFiltre => {
      this.removeAllLineStopLayers();
      if (tFiltre === "persLinesSelectedLinesStops") {
        //Lignes personnalisees avec arrets      
        this.gestionLigneArret.getSelectedLines().forEach(ligne => {
          this.showLineWithStops(ligne);
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

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sliderValue']) {
      //this.sliderValue=changes['sliderValue'].currentValue;
      try {
        this.magnetoFwd(this.mois[this.sliderValue]);
      } catch { }
    }
  }

  newOlMap(layers, target: string): ol.Map {
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
    this.sliderValue=0;
    this.gestionLigneArret.setFinishedLoading(false);
    console.log(this.genStringArrets());
    this.dataService.getRetardArret(this.genStringArrets())
      .subscribe(data => {
        this.ponctualiteData = data;
        console.log(this.ponctualiteData);
        this.magnetoFwd(this.mois[this.sliderValue]);
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

  magnetoFwd(mois: string) {
    this.map.getInteractions().clear();
    ol.interaction.defaults().forEach(interaction => {
      this.map.addInteraction(interaction);
    });

    this.visibleStops.forEach(arret => {
      //this.map.removeInteraction(arret.getHoverInteraction()); NOT WORKING ???     
      arret.initSizeData();

    });

    this.ponctualiteData['features'].forEach(feature => {
      if (feature['properties']['Libelle_Mois'] === mois) {
        this.getArretById(feature['properties']['Arret_id']).addSizeData(feature['properties']['Nb_Departs_Retard']);
      }
    });
    this.visibleStops.forEach(arret => {
      arret.setSizeDataMagneto();
      arret.initDataHoveredStyle();
      /*arret.getHoverInteraction().setProperties({
        style : arret.getDHStyle()
      });
      this.map.getInteractions().forEach(interaction => {
        if(interaction===arret.getHoverInteraction()){
          console.log(interaction);
        }
      })*/
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