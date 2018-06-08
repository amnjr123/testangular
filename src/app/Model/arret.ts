
import * as ol from 'openlayers';

export class Arret {

  id:number;
  nomCommercial:string;
  geo;

  constructor(id:number,nomCommercial:string,lat,lng) {
    this.id=id;
    this.nomCommercial=nomCommercial;
    let point = ol.proj.transform([lng,lat], 'EPSG:4326', 'EPSG:3857');
    this.geo = new ol.layer.Vector({
      source: new ol.source.Vector({
        strategy: ol.loadingstrategy.bbox,
        features: [new ol.Feature({
          geometry: new ol.geom.Point(point)
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
