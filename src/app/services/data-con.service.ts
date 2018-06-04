import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Http, Response} from "@angular/http";

@Injectable()
export class DataConService {
  geoServerHost:String='10.205.8.226:4601';
  dataUrl = 'http://'+this.geoServerHost+'/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Geo_Ligne_Data&maxFeatures=500&outputFormat=application%2Fjson';
  data:any;

  constructor(private http: HttpClient) { 
    
  }

  getRecords() {
    return this.http.get(this.dataUrl).map((data:any) => {
      this.data = data;
      return this.data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

}
