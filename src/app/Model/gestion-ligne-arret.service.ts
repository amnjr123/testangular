import { Injectable, Inject, SimpleChanges } from '@angular/core';
import { Ligne } from './ligne';
import { DataConService } from '../services/data-con.service';
import * as ol from 'openlayers';
import { Arret } from './arret';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subject } from 'rxjs/Subject';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GestionLigneArret {

  //private dataService: DataConService;
  private lignes: Array<Ligne>;
  private arrets: Array<Arret>;
  private donneesArretsTemp;
  private donneesLignes = [null];
  private donneesArrets = [null];
  private geoServerHost: String = '10.205.8.226:4601';
  private fieldsFetched: boolean = false;

  private selectedLines:Array<Ligne>;
  private selectedStops:Array<Arret>;

  fetchDataObs:Subject<any>=new Subject<any>();

  constructor(private dataService: DataConService) {
    this.selectedLines = new Array<Ligne>();
    this.selectedStops = new Array<Arret>();
    this.lignes = new Array<Ligne>();
    this.arrets = new Array<Arret>();
    this.fetchLignesData();
    this.fetchStopData();

  }

  getSelectedLines(){
    return this.selectedLines;
  }

  getSelectedStops(){
    return this.selectedStops;
  }

  setSelectedLines(lignes:Array<Ligne>){
    this.selectedLines=lignes;
  }

  setSelectedStops(arrets:Array<Arret>){
    this.selectedStops=arrets;
  }

  getLignes() {
    return this.lignes;
  } 

  getArrets(){
    return this.arrets;
  }

  isLoading() {
    return this.fieldsFetched;
  }
  setFinishedLoading(l: boolean) {
    this.fieldsFetched = l;
  }

  //Recupérer les données de lignes
  fetchLignesData() {
    this.fieldsFetched = false;
    this.dataService.getLineRecords()
      .subscribe(data => {
        this.donneesLignes = data;
        this.fillLignesArray();
        this.lignes.forEach(ligne => {
          this.fillLineStops(ligne);
        });
        this.fieldsFetched = true;
        }, err => {
        console.log(err);
      });
  }

  fetchStopData(){
    this.fieldsFetched = false;
    this.dataService.getStopRecords()
      .subscribe(data => {
        this.donneesArrets = data;
        this.fillArretsArray();
        this.fieldsFetched = true;
        }, err => {
        console.log(err);
      });
  }

  fillLignesArray() {
    this.donneesLignes['features'].forEach(ligne => {
      var poly = [];
      var underPoly;
      var multiLine = true;
      ligne['geometry']['coordinates'].forEach(coord => {
        coord.forEach(c => {
          try {
            c.forEach(element => { });
            poly.push(ol.proj.transform(c, 'EPSG:4326', 'EPSG:3857'))
            multiLine = true;
          } catch {
            multiLine = false;
          }
        });
        if (!multiLine) {
          poly.push(ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857'));
        }
      });
      var line = new ol.layer.Vector({
        source: new ol.source.Vector({
          strategy: ol.loadingstrategy.bbox,
          features: [new ol.Feature({
            geometry: new ol.geom.LineString(poly),
          })]
        })
      });

      var id = ligne['properties']['id'];
      var dbId = ligne['properties']['Ligne_id'];
      var sens = ligne['properties']['Ligne_Sens'];
      var nomCom = ligne['properties']['LigneLibelleComplet'];
      var type = ligne['properties']['LigneTypeLibelle'];

      var ln: Ligne = new Ligne(id, dbId, sens, nomCom, type, line);

      this.lignes.push(ln);
    });

  }

  fillArretsArray(){
    this.donneesArrets['features'].forEach(arret => {

      var id = arret['properties']['Arret_id'];
      var nomCom = arret['properties']['Arret_NomLong']+' : '+arret['properties']['Arret_NomCommercial'];
      var lat = arret['properties']['Lat'];
      var lng = arret['properties']['Long'];

      var ar: Arret = new Arret(id,nomCom,lat,lng);

      this.arrets.push(ar);
    });
  }

  fillLineStops(line: Ligne) {
    this.donneesArretsTemp = [null];
    this.dataService.getStopLineRecords(line)
      .subscribe(data => {
        //this.donneesArretsTemp = data;
        data['features'].forEach(arret => {
          let a = new Arret(arret['properties']['arret_id'], arret['properties']['Arret_NomCommercial'], arret['properties']['Lat'], arret['properties']['Long']);
          line.addArret(a);
        });
      }, err => {
        console.log(err);
      });
  }

}
