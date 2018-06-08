import { Injectable, Inject } from '@angular/core';
import { Ligne } from './ligne';
import { DataConService } from '../services/data-con.service';
import * as ol from 'openlayers';
import { Arret } from './arret';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable()
export class GestionLigneArret {

  //private dataService: DataConService;
  private lignes: Array<Ligne>;
  private donneesArretsTemp;
  private donneesLignes = [null];
  private geoServerHost: String = '10.205.8.226:4601';
  private fieldsFetched: boolean = false;

  private loading=true;

  constructor(private dataService: DataConService) {
    this.lignes = new Array<Ligne>();
    this.fetchLignesData();
  }

  getLignes() {
    return this.lignes;
  }

  isLoading(){
    return this.loading;
  }

  //Recupérer les données de lignes
  fetchLignesData() {
    this.dataService.getLineRecords()
      .subscribe(data => {
        this.donneesLignes = data;
        this.fillLignesArray();
        console.log(this.lignes);
        this.loading=false;

        this.lignes.forEach(ligne => {
          this.fillLineStops(ligne);
        });
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
