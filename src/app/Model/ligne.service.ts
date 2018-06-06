import { Injectable } from '@angular/core';
import { Arret } from './arret.service';

@Injectable()
export class Ligne {

  id:number;
  dbId:number;
  sens:number;
  nomCommercial:string;
  type:string;
  geo:ol.geom.LineString;
  arrets:Array<Arret>;

  constructor(id,dbId,sens,nomCom,type,geo) {
    this.id=id;
    this.dbId=dbId;
    this.sens=sens;
    this.nomCommercial=nomCom;
    this.type=type;
    this.geo=geo;
  }

  getId(){
    return this.id;
  }
  getdbId(){
    return this.dbId;
  }
  getSens(){
    return this.sens;
  }
  getNomCommercial(){
    return this.nomCommercial
  }
  getGeo(){
    return this.geo;
  }
  getArrets(){
    return this.arrets
  }
  getType(){
    return this.type;
  }

  setSens(sens:number){
    this.sens=sens
  }
  setType(type:string){
    this.type=type;
  }
  setDbId(dbId:number){
    this.dbId=dbId
  }
  setNomCommercial(nom:string){
    this.nomCommercial=nom;
  }
  setGeo(geo){
    this.geo=geo;
  }
  addArret(arret:Arret){
    this.arrets.push(arret);
  }
  removeArret(arret:Arret){
    const index: number = this.arrets.indexOf(arret);
    if (index !== -1) {
        this.arrets.splice(index, 1);
    }  
  }

}
