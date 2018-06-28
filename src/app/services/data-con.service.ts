import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Http, Response } from "@angular/http";
import { Arret } from '../Model/arret';
import { Ligne } from '../Model/ligne';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';

@Injectable()
export class DataConService {
  geoServerHost: String = '10.205.8.226:4601';
  data: any;
  allStopLineData: any;

  constructor(private http: HttpClient) {

  }

  genLineDataUrl() {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Geo_Ligne_Data&maxFeatures=500&outputFormat=application%2Fjson';
  }

  genStopDataUrl() {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Geo_Arrets_Data&maxFeatures=5000&outputFormat=application%2Fjson';
  }

  genStopLineDataUrl(lineId: String, lineDbSensId: number) {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:arretsParLigne&maxFeatures=50&outputFormat=application%2Fjson&viewParams=ligne_id:' + lineId + ';sens_id=' + lineDbSensId;
  }

  genRetardArretURL(arrets: string) {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Ponctualite_Arret_AnneeMois&maxFeatures=10000&outputFormat=application%2Fjson&viewParams=Arret_id:' + arrets;
  }

  genRetardLigneArretURL(ligne: string, annee: string) {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:StopDataByLDMY&maxFeatures=10000&outputFormat=application%2Fjson&viewParams=ligne:[' + ligne + '];annee:[' + annee + '];jour:[Lundi];arret:ALLMEMBERS;mois:[Janvier]';
  }

  getLineRecords() {
    return this.http.get(this.genLineDataUrl()).map((data: any) => {
      this.data = data;
      return this.data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

  getStopRecords() {
    return this.http.get(this.genStopDataUrl()).map((data: any) => {
      return data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

  getStopLineRecords(line: Ligne) {
    
    return this.http.get(this.genStopLineDataUrl(line.getdbId(), line.getSens())).map((data: any) => {
      return data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

  getRetardArret(arrets: string) {
    return this.http.get(this.genRetardArretURL(arrets)).map((data: any) => {
      return data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

  getRetardLigneArret(ligne: string, annee: string) {
    
    return this.http.get(this.genRetardLigneArretURL(ligne, annee)).map((data: any) => {
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
