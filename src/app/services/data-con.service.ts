import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Http, Response} from "@angular/http";
import { Arret } from '../Model/arret';
import { Ligne } from '../Model/ligne';

@Injectable()
export class DataConService {
  geoServerHost:String='10.205.8.226:4601';
  data:any;
  allStopLineData:any;

  constructor(private http: HttpClient) { 
    
  }

  getLineRecords() {
    return this.http.get(this.genLineDataUrl()).map((data:any) => {
      this.data = data;
      return this.data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

  genLineDataUrl(){
    return  'http://'+this.geoServerHost+'/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Geo_Ligne_Data&maxFeatures=500&outputFormat=application%2Fjson';    
  }

  genStopLineDataUrl(lineId:String, lineDbSensId:number){
    return 'http://'+this.geoServerHost+'/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:arretsParLigne&maxFeatures=50&outputFormat=application%2Fjson&viewParams=ligne_id:'+lineId+';sens_id='+lineDbSensId;
  }
/*
  genAllStopLineDataUrl(lineId:String, lineDbSensId:string){
    return 'http://'+this.geoServerHost+'/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:arretsParLigne&maxFeatures=50&outputFormat=application%2Fjson&viewParams=ligne_id:'+lineId+';sens_id='+lineDbSensId;
  }
*/

  genRetardArretURL(arrets:string){
    return 'http://'+this.geoServerHost+'/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Ponctualite_Arret_AnneeMois&maxFeatures=10000&outputFormat=application%2Fjson&viewParams=Arret_id:'+arrets;
  }

  getStopLineRecords(line:Ligne) {
    //console.log(line.getNomCommercial());
    //console.log(this.genStopLineDataUrl(line.getdbId(),line.getSens()));
    return this.http.get(this.genStopLineDataUrl(line.getdbId(),line.getSens())).map((data:any) => {
      //console.log(data);
      return data;     
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

  getRetardArret(arrets:string) {
    //console.log(this.genRetardArretURL(arrets));
    //console.log(line.getNomCommercial());
    //console.log(this.genStopLineDataUrl(line.getdbId(),line.getSens()));
    return this.http.get(this.genRetardArretURL(arrets)).map((data:any) => {
      //console.log(data);
      return data; 
          
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }



  /*
  getAllStopLines() {
    let promise = new Promise((resolve, reject) => {
      let url = this.genAllStopLineDataUrl('%%','%%');
      this.http.get(url)
      .toPromise()
      .then(
        res => {
          this.allStopLineData=res;
          resolve();
        }
      );
    });
    return promise;
  }*/

}
