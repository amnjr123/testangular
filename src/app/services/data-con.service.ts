import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Http, Response } from "@angular/http";
import { Arret } from '../Model/arret';
import { Ligne } from '../Model/ligne';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';
import { Config } from '../../assets/config';

@Injectable()

export class DataConService {

  config = new Config();

  geoServerHost: String = this.config.getGeoServerHost();//  '10.205.8.226:4601';
  nodeServerHost:string = this.config.getNodeServerHost();//'http://10.205.8.226:4605/sqlqry';
  data: any;
  allStopLineData: any;

  constructor(private http: HttpClient) {

  }

  genLineDataUrl() {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Geo_Ligne_Data&maxFeatures=500&outputFormat=application%2Fjson';
  }
  
  genAnneesUrl() {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:annees&maxFeatures=50&outputFormat=application%2Fjson';
  }

  genStopDataUrl() {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:Geo_Arrets_Data&maxFeatures=5000&outputFormat=application%2Fjson';
  }

  genStopLineDataUrl(lineId: String, lineDbSensId: number) {
    return 'http://' + this.geoServerHost + '/geoserver/osm/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=osm:arretsParLigne&maxFeatures=50&outputFormat=application%2Fjson&viewParams=ligne_id:' + lineId + ';sens_id=' + lineDbSensId;
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

  getAnnees(){
    return this.http.get(this.genAnneesUrl()).map((data: any) => {
      return data;
    }, err => {
      if (err) {
        return err.json();
      }
    });
  }

  callNodeServerFPANPJ(annee:string, arret:Array<string>,jour:Array<string>, mois:Array<string>) {
    var i=0;
    var qry = "with t as ("
      +" Select * from OPENQUERY ([SGICUBE],'"
       +"SELECT NON EMPTY { "
       +"[Measures].[Frequentation] "
       +"} ON COLUMNS,  "
       +"NON EMPTY { ("
       +"[Date].[Annee].[Annee].ALLMEMBERS * "
       //+"[Date].[Mois].[Mois].ALLMEMBERS * "
       //+"[Date].[Numero Jour].[Numero Jour].ALLMEMBERS * "
       +"[Date].[Jour de la Semaine].[Jour de la Semaine].ALLMEMBERS * "
       +"[Arret].[Nom Long].[Nom Long].ALLMEMBERS "
       +") } DIMENSION PROPERTIES MEMBER_CAPTION,"
       +"MEMBER_UNIQUE_NAME ON ROWS "
       +"FROM ( "
        +"SELECT ( { ";
          arret.forEach(arr =>{
            i++;
            if (i<arret.length){
              qry = qry + "[Arret].[Nom Long].["+arr+"],";
            } else {
              qry = qry + "[Arret].[Nom Long].["+arr+"] ";
              i=0;
            }
          }); 
          if (jour.length>0 && jour.length<7){
          qry = qry +"} ) ON COLUMNS "
            +"FROM ( SELECT ( { ";
              jour.forEach(j=>{
                i++;
                if (i<jour.length){
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"] ,";
                } else {
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"]  ";
                  i=0;
                }    
              });
            }
            if (mois.length>0 && mois.length<12){
              qry = qry +"} ) ON COLUMNS "
                +"FROM ( SELECT ( { ";
                  mois.forEach(m=>{
                    i++;
                    if(i<mois.length){
                      qry=qry + "[Date].[Mois].["+m+"],";
                    } else {
                      qry=qry + "[Date].[Mois].["+m+"] ";
                      i=0;
                    }
                    
                  });
                }
                  qry = qry +"} ) ON COLUMNS "
                    +"FROM ( SELECT ( { "
                      +"[Date].[Annee].["+annee+"] "
                      +"} ) ON COLUMNS "
                      +"FROM [CubeSGI])";
                      if (jour.length>0 && jour.length<7) qry=qry+")";
                      if (mois.length>0 && mois.length<12) qry=qry+")";
                      qry=qry+") CELL PROPERTIES VALUE, BACK_COLOR, FORE_COLOR, FORMATTED_VALUE, FORMAT_STRING, FONT_NAME, FONT_SIZE, FONT_FLAGS')) "
      
      +"Select	convert(varchar,[[Date]].[Annee]].[Annee]].[MEMBER_CAPTION]]]) as annee,"
          //+"convert(varchar,[[Date]].[Mois]].[Mois]].[MEMBER_CAPTION]]]) as mois,"
          //+"convert(varchar,[[Date]].[Numero Jour]].[Numero Jour]].[MEMBER_CAPTION]]]) as numJour,"
          +"convert(varchar,[[Date]].[Jour de la Semaine]].[Jour de la Semaine]].[MEMBER_CAPTION]]]) as jour,"
          +"convert(varchar,[[Arret]].[Nom Long]].[Nom Long]].[MEMBER_CAPTION]]]) as arret,"
          +"convert(int,[[Measures]].[Frequentation]]]) as freq from t";

    let req = { q : qry};
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    return this.http.post(this.nodeServerHost, req, {
      headers: headers
    }).map((data:any) => {
      return data
    });
  }

  callNodeServerFPANPM(annee:string, arret:Array<string>,jour:Array<string>, mois:Array<string>) {
    var i=0;
    var qry = "with t as ("
      +" Select * from OPENQUERY ([SGICUBE],'"
       +"SELECT NON EMPTY { "
       +"[Measures].[Frequentation] "
       +"} ON COLUMNS,  "
       +"NON EMPTY { ("
       +"[Date].[Annee].[Annee].ALLMEMBERS * "
       +"[Date].[Mois].[Mois].ALLMEMBERS * "
       //+"[Date].[Numero Jour].[Numero Jour].ALLMEMBERS * "
       //+"[Date].[Jour de la Semaine].[Jour de la Semaine].ALLMEMBERS * "
       +"[Arret].[Nom Long].[Nom Long].ALLMEMBERS "
       +") } DIMENSION PROPERTIES MEMBER_CAPTION,"
       +"MEMBER_UNIQUE_NAME ON ROWS "
       +"FROM ( "
        +"SELECT ( { ";
          arret.forEach(arr =>{
            i++;
            if (i<arret.length){
              qry = qry + "[Arret].[Nom Long].["+arr+"],";
            } else {
              qry = qry + "[Arret].[Nom Long].["+arr+"] ";
              i=0;
            }
          }); 
          if (jour.length>0 && jour.length<7){
          qry = qry +"} ) ON COLUMNS "
            +"FROM ( SELECT ( { ";
              jour.forEach(j=>{
                i++;
                if (i<jour.length){
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"] ,";
                } else {
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"]  ";
                  i=0;
                }    
              });
            }
            if (mois.length>0 && mois.length<12){
              qry = qry +"} ) ON COLUMNS "
                +"FROM ( SELECT ( { ";
                  mois.forEach(m=>{
                    i++;
                    if(i<mois.length){
                      qry=qry + "[Date].[Mois].["+m+"],";
                    } else {
                      qry=qry + "[Date].[Mois].["+m+"] ";
                      i=0;
                    }
                    
                  });
                }
                  qry = qry +"} ) ON COLUMNS "
                    +"FROM ( SELECT ( { "
                      +"[Date].[Annee].["+annee+"] "
                      +"} ) ON COLUMNS "
                      +"FROM [CubeSGI])";
                      if (jour.length>0 && jour.length<7) qry=qry+")";
                      if (mois.length>0 && mois.length<12) qry=qry+")";
                      qry=qry+") CELL PROPERTIES VALUE, BACK_COLOR, FORE_COLOR, FORMATTED_VALUE, FORMAT_STRING, FONT_NAME, FONT_SIZE, FONT_FLAGS')) "
      
      +"Select	convert(varchar,[[Date]].[Annee]].[Annee]].[MEMBER_CAPTION]]]) as annee,"
          +"convert(varchar,[[Date]].[Mois]].[Mois]].[MEMBER_CAPTION]]]) as mois,"
          //+"convert(varchar,[[Date]].[Numero Jour]].[Numero Jour]].[MEMBER_CAPTION]]]) as numJour,"
          //+"convert(varchar,[[Date]].[Jour de la Semaine]].[Jour de la Semaine]].[MEMBER_CAPTION]]]) as jour,"
          +"convert(varchar,[[Arret]].[Nom Long]].[Nom Long]].[MEMBER_CAPTION]]]) as arret,"
          +"convert(int,[[Measures]].[Frequentation]]]) as freq from t";

    let req = { q : qry};
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    return this.http.post(this.nodeServerHost, req, {
      headers: headers
    }).map((data:any) => {
      return data
    });
  }


  callNodeServerFPANPH(annee:string, arret:Array<string>,jour:Array<string>, mois:Array<string>) {
    var i=0;
    var qry = "with t as ("
      +" Select * from OPENQUERY ([SGICUBE],'"
       +"SELECT NON EMPTY { "
       +"[Measures].[Frequentation] "
       +"} ON COLUMNS,  "
       +"NON EMPTY { ("
       +"[Date].[Annee].[Annee].ALLMEMBERS * "
       +"[Plage Horaire].[Heure].[Heure].ALLMEMBERS * "
       //+"[Date].[Mois].[Mois].ALLMEMBERS * "
       //+"[Date].[Numero Jour].[Numero Jour].ALLMEMBERS * "
       //+"[Date].[Jour de la Semaine].[Jour de la Semaine].ALLMEMBERS * "
       +"[Arret].[Nom Long].[Nom Long].ALLMEMBERS "
       +") } DIMENSION PROPERTIES MEMBER_CAPTION,"
       +"MEMBER_UNIQUE_NAME ON ROWS "
       +"FROM ( "
        +"SELECT ( { ";
          arret.forEach(arr =>{
            i++;
            if (i<arret.length){
              qry = qry + "[Arret].[Nom Long].["+arr+"],";
            } else {
              qry = qry + "[Arret].[Nom Long].["+arr+"] ";
              i=0;
            }
          });
          if (jour.length>0 && jour.length<7){ 
          qry = qry +"} ) ON COLUMNS "
            +"FROM ( SELECT ( { ";
              jour.forEach(j=>{
                i++;
                if (i<jour.length){
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"] ,";
                } else {
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"]  ";
                  i=0;
                }    
              });
            }
            if (mois.length>0 && mois.length<12){
              qry = qry +"} ) ON COLUMNS "
                +"FROM ( SELECT ( { ";
                  mois.forEach(m=>{
                    i++;
                    if(i<mois.length){
                      qry=qry + "[Date].[Mois].["+m+"],";
                    } else {
                      qry=qry + "[Date].[Mois].["+m+"] ";
                      i=0;
                    }
                    
                  });
                }
                  qry = qry +"} ) ON COLUMNS "
                    +"FROM ( SELECT ( { "
                      +"[Date].[Annee].["+annee+"] "
                      +"} ) ON COLUMNS "
                      +"FROM [CubeSGI])";
                      if (jour.length>0 && jour.length<7) qry=qry+")";
                      if (mois.length>0 && mois.length<12) qry=qry+")";
                      qry=qry+") CELL PROPERTIES VALUE, BACK_COLOR, FORE_COLOR, FORMATTED_VALUE, FORMAT_STRING, FONT_NAME, FONT_SIZE, FONT_FLAGS')) "
      
      +"Select	convert(varchar,[[Date]].[Annee]].[Annee]].[MEMBER_CAPTION]]]) as annee,"
          +"convert(varchar,[[Plage Horaire]].[Heure]].[Heure]].[MEMBER_CAPTION]]]) as heure,"
          //+"convert(varchar,[[Date]].[Numero Jour]].[Numero Jour]].[MEMBER_CAPTION]]]) as numJour,"
          //+"convert(varchar,[[Date]].[Jour de la Semaine]].[Jour de la Semaine]].[MEMBER_CAPTION]]]) as jour,"
          +"convert(varchar,[[Arret]].[Nom Long]].[Nom Long]].[MEMBER_CAPTION]]]) as arret,"
          +"convert(int,[[Measures]].[Frequentation]]]) as freq from t";

    let req = { q : qry};
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    return this.http.post(this.nodeServerHost, req, {
      headers: headers
    }).map((data:any) => {
      return data
    });
  }



  callNodeServerFPANPDH(annee:string, arret:Array<string>,jour:Array<string>, mois:Array<string>) {
    var i=0;
    var qry = "with t as ("
      +" Select * from OPENQUERY ([SGICUBE],'"
       +"SELECT NON EMPTY { "
       +"[Measures].[Frequentation] "
       +"} ON COLUMNS,  "
       +"NON EMPTY { ("
       +"[Date].[Annee].[Annee].ALLMEMBERS * "
       +"[Plage Horaire].[Heure].[Heure].ALLMEMBERS * "
       //+"[Date].[Mois].[Mois].ALLMEMBERS * "
       //+"[Date].[Numero Jour].[Numero Jour].ALLMEMBERS * "
       +"[Date].[Jour de la Semaine].[Jour de la Semaine].ALLMEMBERS * "
       +"[Arret].[Nom Long].[Nom Long].ALLMEMBERS "
       +") } DIMENSION PROPERTIES MEMBER_CAPTION,"
       +"MEMBER_UNIQUE_NAME ON ROWS "
       +"FROM ( "
        +"SELECT ( { ";
          arret.forEach(arr =>{
            i++;
            if (i<arret.length){
              qry = qry + "[Arret].[Nom Long].["+arr+"],";
            } else {
              qry = qry + "[Arret].[Nom Long].["+arr+"] ";
              i=0;
            }
          }); 
          if (jour.length>0 && jour.length<7){
            qry = qry +"} ) ON COLUMNS "
            +"FROM ( SELECT ( { ";
              jour.forEach(j=>{
                i++;
                if (i<jour.length){
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"] ,";
                } else {
                  qry=qry + "[Date].[Jour de la Semaine].["+j+"]  ";
                  i=0;
                }    
              });
          }
              if (mois.length>0 && mois.length<12){
                qry = qry +"} ) ON COLUMNS "
                +"FROM ( SELECT ( { ";
                  mois.forEach(m=>{
                    i++;
                    if(i<mois.length){
                      qry=qry + "[Date].[Mois].["+m+"],";
                    } else {
                      qry=qry + "[Date].[Mois].["+m+"] ";
                      i=0;
                    }
                    
                  });
              }
                  qry = qry +"} ) ON COLUMNS "
                    +"FROM ( SELECT ( { "
                      +"[Date].[Annee].["+annee+"] "
                      +"} ) ON COLUMNS "
                      +"FROM [CubeSGI])";
                      if (jour.length>0 && jour.length<7) qry=qry+")";
                      if (mois.length>0 && mois.length<12) qry=qry+")";
                      qry=qry+") CELL PROPERTIES VALUE, BACK_COLOR, FORE_COLOR, FORMATTED_VALUE, FORMAT_STRING, FONT_NAME, FONT_SIZE, FONT_FLAGS')) "
      
      +"Select	convert(varchar,[[Date]].[Annee]].[Annee]].[MEMBER_CAPTION]]]) as annee,"
          +"convert(varchar,[[Plage Horaire]].[Heure]].[Heure]].[MEMBER_CAPTION]]]) as heure,"
          //+"convert(varchar,[[Date]].[Numero Jour]].[Numero Jour]].[MEMBER_CAPTION]]]) as numJour,"
          +"convert(varchar,[[Date]].[Jour de la Semaine]].[Jour de la Semaine]].[MEMBER_CAPTION]]]) as jour,"
          +"convert(varchar,[[Arret]].[Nom Long]].[Nom Long]].[MEMBER_CAPTION]]]) as arret,"
          +"convert(int,[[Measures]].[Frequentation]]]) as freq from t";

    let req = { q : qry};
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    return this.http.post(this.nodeServerHost, req, {
      headers: headers
    }).map((data:any) => {
      return data
    });
  }

}
