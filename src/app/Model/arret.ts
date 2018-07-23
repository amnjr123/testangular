
import * as ol from 'openlayers';

export class Arret {

  id: number;
  nomCommercial: string;
  nomLong:string;
  geo;
  hStyle: ol.style.Style;
  dHStyle: ol.style.Style;
  hoverInteraction: ol.interaction.Select;
  dataHoverInteraction: ol.interaction.Select;
  sizeData:number=0;
  data:Array<any>;

  constructor(id: number,nomLong:string, nomCommercial: string, lat, lng) {
    this.data= new Array<any>();  
    this.id = id;
    this.nomCommercial = nomCommercial;
    this.nomLong = nomLong;
    let point = ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857');
    this.geo = new ol.layer.Vector({
      source: new ol.source.Vector({
        strategy: ol.loadingstrategy.bbox,
        features: [new ol.Feature({
          geometry: new ol.geom.Point(point)
        })]
      })
    });
    this.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#000000',
          width: 5
        }),
        radius: 8,
        fill: new ol.style.Fill({
          color: '#FFFFFF'
        })
      }),
      text: new ol.style.Text({
        //text : arret.getNomCommercial(),
        font: 'Bold 14px  \'lato\''
      })
    }));
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

  getDataHoverInteraction(){
    return this.dataHoverInteraction;
  }
  getDHStyle(){
    return this.dHStyle;  
  }

  getData(){
    return this.data;
  }

  getNomLong(){
    return this.nomLong;
  }

  setNomCommercial(nom: string) {
    this.nomCommercial = nom;
  }

  setNomLong(nom:string){
    this.nomLong=nom;
  }

  setGeo(geo) {
    this.geo = geo
  }

  setStyle(style: ol.style.Style) {
    this.geo.setStyle(style);
  }

  setData(data:Array<any>){
    this.data=data;
  }

  addSizeData(data:number){
    this.sizeData=this.sizeData+data;
  }

  initSizeData(){
    this.sizeData=0;
  }
/*
  setSizeData(){
    //this.sizeData=data;
    let size = this.sizeData/4000
    this.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#06A1EF',
          width: 0
        }),
        radius: size,
        fill: new ol.style.Fill({
          color: '#06A1EF'
        })
      }),
      text: new ol.style.Text({
        //text : this.sizeData+' Départs en retard',
        font: 'Bold 14px  \'lato\''
      })
    }));
  }
*/

  getColor(value){
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,40%,0.9)"].join("");
  }

  setSizeDataMagneto(){
    //this.sizeData=data;
    let size = 0;
    if (this.sizeData>=2000){
      size=1
    } else {
      size = this.sizeData/2000;
    }
    this.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
        snapToPixel:false,
        /*stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 0
        }),*/
        radius: size*15,
        fill: new ol.style.Fill({
          color: this.getColor(size)//'#06A1EF'
        })
      }),
      text: new ol.style.Text({
        //text : this.sizeData+' Départs en retard',
        font: 'Bold 14px  \'lato\''
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
        radius: textLength*5.5,
        fill: new ol.style.Fill({
          color: '#FFFFFF'
        })
      }),
      text: new ol.style.Text({
        text : this.getNomCommercial(),
        font: 'Bold 14px  \'lato\''
      })
    });

    this.hoverInteraction = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove,
      style: this.hStyle,
      layers: [this.geo]
    });
  }

  initDataHoveredStyle(){

    let size = 0;
    if (this.sizeData>=2000){
      size=1
    } else {
      size = this.sizeData/2000;
    }

    let text = 'Arret \' '+this.getNomCommercial()+' \'\n'+this.sizeData+'\nDéparts en retard';
    let textLength = text.length;


    this.dHStyle = new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 3
        }),
        radius: textLength*2,
        fill: new ol.style.Fill({
          color: this.getColor(size)
        })
      }),
      text: new ol.style.Text({
        text : text,
        font: 'Bold 14px  \'lato\'',
        fill: new ol.style.Fill({
          color: 'white'
        }),
      })
    });

    this.dataHoverInteraction = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove,
      style: this.dHStyle,
      layers: [this.geo]
    });
  }


}
