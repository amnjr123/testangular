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
  private annees:Array<string>;
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
  fetchMgtSpeedObs:Subject<any>=new Subject<any>();

  arretsSetObs:Subject<any>=new Subject<any>();


  constructor(private dataService: DataConService) {
    this.annees = new Array<string>();
    this.selectedLines = new Array<Ligne>();
    this.selectedStops = new Array<Arret>();
    this.lignes = new Array<Ligne>();
    this.arrets = new Array<Arret>();
    this.fetchYears();
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

  getAnnees(){
    return this.annees;
  }

  getArretsSetOBS(){
    return this.arretsSetObs;
  }

  isLoading() {
    return this.fieldsFetched;
  }
  setFinishedLoading(l: boolean) {
    this.fieldsFetched = l;
  }

  //recuperer les annees
  fetchYears(){
    this.dataService.getAnnees().subscribe(data =>{
      data['features'].forEach(feature => {
        this.annees.push(feature['properties']['annees']);
      });
    }, err => {
      console.log(err);
    });
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
      var nomCom = arret['properties']['Arret_NomCommercial'];
      var nomLong = arret['properties']['Arret_NomLong']
      var lat = arret['properties']['Lat'];
      var lng = arret['properties']['Long'];

      var ar: Arret = new Arret(id,nomLong,nomCom,lat,lng);

      this.arrets.push(ar);
    });
  }

  fillLineStops(line: Ligne) {
    this.donneesArretsTemp = [null];
    this.dataService.getStopLineRecords(line)
      .subscribe(data => {
        //this.donneesArretsTemp = data;
        data['features'].forEach(arret => {
          let a = new Arret(arret['properties']['arret_id'],arret['properties']['Arret_NomLong'], arret['properties']['Arret_NomCommercial'], arret['properties']['Lat'], arret['properties']['Long']);
          line.addArret(a);
        });
      }, err => {
        console.log(err);
      });
  }

  findArretByNomLong(nomLong:string):Arret{
    for(let i=1;i<this.arrets.length;i++){
      if (this.arrets[i].getNomLong()===nomLong){
        return this.arrets[i];
      }
    }
  }

  //Recuperer les donnees
  fetchData(annee:string, arrets:Array<Arret>, typeNavigation:string, jours:Array<string>, mois:Array<string>){
    this.setFinishedLoading(false);

    /*let numArrets=arrets.length;
    numArrets=350;
    let iterations = 1+((numArrets-(numArrets % 100))/100);
    let lastIteration = iterations;
*/
    let nlArr:Array<string>=new Array<string>();
    arrets.forEach(a=>{
      nlArr.push(a.getNomLong());
    });

    this.arrets.forEach(arret=>{
      arret.cleardayData();
      arret.clearMonthData();
      arret.clearHourData();
      arret.clearDayHourData();

    })

    if (typeNavigation==='jour'){

      this.dataService.callNodeServerFPANPJ(annee, nlArr,jours, mois).subscribe(data =>{
        console.log(data);
        data.forEach(d => {
          this.findArretByNomLong(d['arret']).setDayData(d['jour'],d['freq']);
        });
          this.setFinishedLoading(true);
          this.arretsSetObs.next(true);
          this.arretsSetObs.next('jour');
      });

    } else if (typeNavigation==='mois'){

      this.dataService.callNodeServerFPANPM(annee, nlArr,jours, mois).subscribe(data =>{
        console.log(data);
        data.forEach(d => {
          this.findArretByNomLong(d['arret']).setMonthData(d['mois'],d['freq']);
        });
          this.setFinishedLoading(true);
          this.arretsSetObs.next(true);
          this.arretsSetObs.next('mois');
      });

    } else if (typeNavigation==='heure'){

      this.dataService.callNodeServerFPANPH(annee, nlArr,jours, mois).subscribe(data =>{
        console.log(data);
        data.forEach(d => {
          this.findArretByNomLong(d['arret']).setHourData(d['heure'],d['freq']);
        });
          this.setFinishedLoading(true);
          this.arretsSetObs.next(true);
          this.arretsSetObs.next('heure');
      });

    } else if (typeNavigation==='jourHeure'){

      this.dataService.callNodeServerFPANPDH(annee, nlArr,jours, mois).subscribe(data =>{
        console.log(data);
        data.forEach(d => {
          this.findArretByNomLong(d['arret']).setDayHourData(d['jour'],d['heure'],d['freq']);
          //console.log(d['jour']+' '+d['heure']+' '+d['freq']);
        });
          this.setFinishedLoading(true);
          this.arretsSetObs.next(true);
          this.arretsSetObs.next('jourHeure');
      });

    }

  }

}