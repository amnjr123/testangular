
import * as ol from 'openlayers';

export class Arret {

  id: number;
  nomCommercial: string;
  geo;
  hStyle: ol.style.Style;
  hoverInteraction: ol.interaction.Select;
  sizeData:number;

  constructor(id: number, nomCommercial: string, lat, lng) {
    this.id = id;
    this.nomCommercial = nomCommercial;
    let point = ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
    this.geo = new ol.layer.Vector({
      source: new ol.source.Vector({
        strategy: ol.loadingstrategy.bbox,
        features: [new ol.Feature({
          geometry: new ol.geom.Point(point)
        })]
      })
    });
    this.initHoveredStyle();

  }

  getId() {
    return this.id;
  }
  getNomCommercial() {
    return this.nomCommercial;
  }
  getGeo() {
    return this.geo;
  }
  getHoverInteraction(){
    return this.hoverInteraction;
  }

  setNomCommercial(nom: string) {
    this.nomCommercial = nom;
  }
  setGeo(geo) {
    this.geo = geo
  }

  setStyle(style: ol.style.Style) {
    this.geo.setStyle(style);
  }

  setSizeData(data:number){
    this.sizeData=data;
    this.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#06A1EF',
          width: 0
        }),
        radius: this.sizeData,
        fill: new ol.style.Fill({
          color: '#06A1EF'
        })
      }),
      text: new ol.style.Text({
        //text : this.getNomCommercial(),
        font: 'Bold 14px  \'Calibri\''
      })
    }));
  }

  initHoveredStyle(){

    let textLength=this.getNomCommercial().length;

    this.hStyle = new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#FF8300',
          width: 5
        }),
        radius: textLength*4.5,
        fill: new ol.style.Fill({
          color: '#FFFFFF'
        })
      }),
      text: new ol.style.Text({
        text : this.getNomCommercial(),
        font: 'Bold 14px  \'Calibri\''
      })
    });

    this.hoverInteraction = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove,
      style: this.hStyle,
      layers: [this.geo]
    });
  }


}
