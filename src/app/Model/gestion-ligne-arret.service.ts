import { Injectable, Inject } from '@angular/core';
import { Ligne } from './ligne.service';
import { DataConService } from '../services/data-con.service';
import * as ol from 'openlayers';


export class GestionLigneArret {

  //private dataService: DataConService;
  private lignes: Array<Ligne>;
  private donneesLignes=[null];
  private geoServerHost: String = '10.205.8.226:4601';
  

  constructor(private dataService: DataConService) {
    this.lignes = new Array<Ligne>();
    this.fetchLignesData();
  }

  getLignes() {
    return this.lignes;
  }

  //Recupérer les données de lignes
  fetchLignesData() {
    this.dataService.getLineRecords()
      .subscribe(data => {
        this.donneesLignes = data;
        this.fillLignesArray();
      }, err => {
        console.log(err);
      });
  }

  fillLignesArray() {
    var geo;
    this.donneesLignes.forEach(ligne => {
      var line:ol.geom.LineString = new ol.geom.LineString(ligne['features']['geometry']['coordinates']);
      var id = ligne['features']['properties']['id'];
      var dbId = ligne['features']['properties']['Ligne_id'];
      var sens = ligne['features']['properties']['Ligne_Sens'];
      var nomCom = ligne['features']['properties']['LigneLibelleComplet'];
      var type = ligne['features']['properties']['LigneTypeLibelle'];
      this.lignes.push(new Ligne(id, dbId,sens,nomCom,type,line));
    });
  }

  getFirstLigne(){
    return this.lignes[1];
  }


}
