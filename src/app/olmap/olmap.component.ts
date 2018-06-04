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

  constructor(private dataService: DataConService) {
    this.lineData = new Array<any>();
  }

  geoServerHost:String='10.205.8.226:4601';
  geoServerWmsUrl: string = 'http://'+this.geoServerHost+'/geoserver/osm/wms';
  map: ol.Map;

  mapLayers;
  osmWorldMapLayers = [new ol.layer.Tile({ source: new ol.source.OSM() })];
  lignes: Array<ol.layer.Vector> = [null];
  selectedLine: number = 1;
  lineData;
  hoverInteraction = [null];
  hoveredLine:string;


  genWfsUrl(typename: string, maxFeatures: string, viewparams: string) {
    return 'http://'+this.geoServerHost+'/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typename + '&maxFeatures=' + maxFeatures + '&outputFormat=application%2Fjson&viewparams=' + viewparams;
  }

  getSelectedLineStyle(lineId){
    this.hoveredLine=this.lineNameById(lineId);
    console.log(this.hoveredLine);
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#FF8300',
        width: 10,
      }),
      text:new ol.style.Text({
        text:this.hoveredLine,
        font:'Bold 25px  \'Calibri\'',
        
      })
    })
  
  }

  lineNameById(id):string{
    var LigneLibelleComplet;
    this.lineData['features'].forEach(feature => {
      if (feature['properties']['id'] === id) {
        LigneLibelleComplet=feature['properties']['LigneLibelleComplet'];
      } else {
        return'';
      }
    });
    return LigneLibelleComplet;
  }
  /*
  dataAvailable(){
    var da = false;
    while(!da){
      if(this.lignes[this.selectedLine] === null){
        da=false;
      } else {
        da=true;
      }
    }
  }*/

  ngOnInit() {
    this.getRecords();
  }

  getLineShapes() {
    //Chargement Layers lignes
    this.lineData['features'].forEach(feature => {
      if (feature['properties']['LigneTypeLibelle'] === 'Bus') {
        this.lignes.push(this.fetchmapLineFeature('osm:MSSLines', '1', "id:" + feature['properties']['id'], '#0DB2A6', 5));
      } else if (feature['properties']['LigneTypeLibelle'] === 'Tram') {
        this.lignes.push(this.fetchmapLineFeature('osm:MSSLines', '1', "id:" + feature['properties']['id'], '#CF1111', 7));
      }
    });
  }


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
    this.map = this.newOlMap(this.mapLayers,'map');
    //this.map = this.newOlMap(this.osmWorldMapLayers, 'map');
    /*
    for (var j = 1; j < this.lignes.length; j++) {
      //this.lignes[j].setVisible(false);
      this.map.addLayer(this.lignes[j]);
    }
    */



    this.map.on('pointermove', function (evt: ol.MapBrowserEvent) {
      //console.log(evt.coordinate);
      /*this.map.forEachLayerAtPixel(evt.pixel, function (layer) {
          console.log('layer hovered');
      });*/
    });
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

  fetchmapLineFeature(sdLayerName: string, maxFeatures: string, vp: string, color: string, width: number) {
    var vectorSource = new ol.source.Vector({
      format: new ol.format.GeoJSON,
      url: this.genWfsUrl(sdLayerName, maxFeatures, vp),
      strategy: ol.loadingstrategy.bbox
    });

    var layer = new ol.layer.Vector({
      source: vectorSource
    });

    var style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: color,
        width: width
      })
    })

    layer.setStyle(style);

    //console.log(layer.getProperties());
    return layer;

  }

  showSelectedLine() {
    this.map.addLayer(this.lignes[this.selectedLine]);

    this.hoverInteraction[this.selectedLine] = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove,
      style: this.getSelectedLineStyle(this.selectedLine),
      layers: [this.lignes[this.selectedLine]]
    });
    this.map.addInteraction(this.hoverInteraction[this.selectedLine]);
  }


  hideSelectedLine() {
    this.map.removeLayer(this.lignes[this.selectedLine]);
    this.map.removeInteraction(this.hoverInteraction[this.selectedLine]);
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