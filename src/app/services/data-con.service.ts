import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Http, Response} from "@angular/http";

@Injectable()
export class DataConService {
  geoServerHost:String='10.205.8.226:4601';
  data:any;

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

  getStopLineRecords(lineId:String, lineDbSensId:number) {
    console.log(this.genStopLineDataUrl(lineId,lineDbSensId));
    return this.http.get(this.genStopLineDataUrl(lineId,lineDbSensId)).map((data:any) => {
      this.data = data;
      return this.data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

}
