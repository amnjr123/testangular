import { Arret } from './arret';
import * as ol from 'openlayers';
import { timer } from 'rxjs/observable/timer';

export class Ligne {

  id: number;
  dbId: string;
  sens: number;
  nomCommercial: string;
  type: string;
  geo: ol.layer.Vector;
  arrets: Array<Arret> = new Array<Arret>();
  style: ol.style.Style;
  hstyle: ol.style.Style;
  hoverInteraction: ol.interaction.Select;
  timerAutoPlay = timer();
  timerSub;

  constructor(id, dbId, sens, nomCom, type, geo) {
    this.id = id;
    this.dbId = dbId;
    this.sens = sens;
    this.nomCommercial = nomCom;
    this.type = type;
    this.geo = geo;
    this.initGeo();
  }


  getHoverInteraction() {
    return this.hoverInteraction;
  }
  getId(): number {
    return this.id;
  }
  getdbId(): string {
    return this.dbId;
  }
  getSens(): number {
    return this.sens;
  }
  getNomCommercial(): string {
    return this.nomCommercial
  }
  getGeo(): ol.layer.Vector {
    return this.geo;
  }
  getArrets(): Array<Arret> {
    return this.arrets
  }
  getType(): string {
    return this.type;
  }

  setSens(sens: number) {
    this.sens = sens
  }
  setType(type: string) {
    this.type = type;
  }
  setDbId(dbId: string) {
    this.dbId = dbId
  }
  setNomCommercial(nom: string) {
    this.nomCommercial = nom;
  }
  setGeo(geo) {
    this.geo = geo;
  }
  addArret(arret: Arret) {
    this.arrets.push(arret);
  }
  removeArret(arret: Arret) {
    const index: number = this.arrets.indexOf(arret);
    if (index !== -1) {
      this.arrets.splice(index, 1);
    }
  }
  getStyle(): ol.style.Style {
    return this.style;
  }

  initGeo() {
    var color: string;
    var width: number;

    if (this.type.toLowerCase() === 'bus') {
      color = '#0DB2A6';
      width = 5;
    } else if (this.type.toLowerCase() === 'tram') {
      color = '#CF1111';
      width = 7;
    } else {
      color = '#000000';
      width = 2;
    }

    this.style = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: color,
        width: width
      })
    });
    this.geo.setStyle(this.style);

    this.hstyle = new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#FF8300',
        width: 10,
      }),
      text: new ol.style.Text({
        text: this.nomCommercial,
        font: 'Bold 18px  \'lato\'',
        fill: new ol.style.Fill({
          color: 'white'
        }),
        stroke: new ol.style.Stroke({
          color: '#FF8300',
          width: 3
        })
      }),

    });

    this.hoverInteraction = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove,
      style: this.hstyle,
      layers: [this.geo]
    });
  }

  highlight(t: number, s: number) {
    this.timerAutoPlay = timer(0, s);
    try { this.timerSub.unsubscribe(); } catch { console.log("timer already unsubscribed"); }
    var i = 0;
    this.timerSub = this.timerAutoPlay.subscribe(x => {
      if (i < t) {
        if (this.geo.getStyle() === this.style) {
          this.geo.setStyle(this.hstyle);
        } else {
          this.geo.setStyle(this.style);
        }
        i++;
      } else {
        this.geo.setStyle(this.style);
        this.timerSub.unsubscribe();
      }
    });
  }


}
