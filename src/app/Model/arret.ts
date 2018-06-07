
import * as ol from 'openlayers';

export class Arret {

  id:number;
  nomCommercial:string;
  geo;

  constructor(id:number,nomCommercial:string,lat,lng) {
    this.id=id;
    this.nomCommercial=nomCommercial;
    this.geo = new ol.layer.Vector({
      source: new ol.source.Vector({
        strategy: ol.loadingstrategy.bbox,
        features: [new ol.Feature({
          geometry: new ol.geom.Point([lat,lng]),
        })]
      })
    }); 

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
