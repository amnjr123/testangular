import { Injectable } from '@angular/core';

@Injectable()
export class Arret {

  id:number;
  nomCommercial:string;
  geo;

  constructor(id:number) {
    this.id=id;
  }

  getId(){
    return this.id;
  }
  getNomCommercial(){
    return this.nomCommercial;
  }
  getGeo(){
    return this.geo;
  }

  setNomCommercial(nom:string){
    this.nomCommercial=nom;
  }
  setGeo(geo){
    this.geo=geo
  }


}
