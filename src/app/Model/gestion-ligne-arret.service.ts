import { Injectable, Inject } from '@angular/core';
import { Ligne } from './ligne';
import { DataConService } from '../services/data-con.service';
import * as ol from 'openlayers';
import { Arret } from './arret';

@Injectable()
export class GestionLigneArret {

  //private dataService: DataConService;
  private lignes: Array<Ligne>;
  private donneesArretsTemp=[null];
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
    this.donneesLignes['features'].forEach(ligne => {      
      var poly=[];
      ligne['geometry']['coordinates'].forEach(coord => {
        poly.push(ol.proj.transform(coord, 'EPSG:4326', 'EPSG:3857'));
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
      this.fetchLineStops(dbId,sens)

      var ln:Ligne = new Ligne(id, dbId,sens,nomCom,type,line);
/*
      this.donneesArretsTemp['features'].forEach(arret => {
        var a = new Arret(arret['properties']['arret_id'],arret['properties']['Arret_NomCommercial'],arret['properties']['Lat'],arret['properties']['Long']);  
        ln.getArrets().push(a);
      });
*/
      this.lignes.push(ln);
    });

  }

  fetchLineStops(lineDbId: string, lineDbSensId: number) {
    this.donneesArretsTemp=[null];
    this.dataService.getStopLineRecords(lineDbId, lineDbSensId)
      .subscribe(data => {
        this.donneesArretsTemp = data;
      }, err => {
        console.log(err);
      });
  }

}
