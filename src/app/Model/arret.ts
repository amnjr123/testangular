import * as ol from 'openlayers';
import { Subject } from 'rxjs/Subject';

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
  monthData={'Janvier':0,'Février':0,'Mars':0,'Avril':0,'Mai':0,'Juin':0,'Juillet':0,'Aout':0,'Septembre':0,'Octobre':0,'Novembre':0,'Décembre':0};
  dayData={'Lundi':0,'Mardi':0,'Mercredi':0,'Jeudi':0,'Vendredi':0,'Samedi':0,'Dimanche':0};
  hourData={0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0};  
  dayHourData={'Lundi_0':0,'Lundi_1':0,'Lundi_2':0,'Lundi_3':0,'Lundi_4':0,'Lundi_5':0,'Lundi_6':0,'Lundi_7':0,'Lundi_8':0,'Lundi_9':0,'Lundi_10':0,'Lundi_11':0,'Lundi_12':0,'Lundi_13':0,'Lundi_14':0,'Lundi_15':0,'Lundi_16':0,'Lundi_17':0,'Lundi_18':0,'Lundi_19':0,'Lundi_20':0,'Lundi_21':0,'Lundi_22':0,'Lundi_23':0,'Mardi_0':0,'Mardi_1':0,'Mardi_2':0,'Mardi_3':0,'Mardi_4':0,'Mardi_5':0,'Mardi_6':0,'Mardi_7':0,'Mardi_8':0,'Mardi_9':0,'Mardi_10':0,'Mardi_11':0,'Mardi_12':0,'Mardi_13':0,'Mardi_14':0,'Mardi_15':0,'Mardi_16':0,'Mardi_17':0,'Mardi_18':0,'Mardi_19':0,'Mardi_20':0,'Mardi_21':0,'Mardi_22':0,'Mardi_23':0,'Mercredi_0':0,'Mercredi_1':0,'Mercredi_2':0,'Mercredi_3':0,'Mercredi_4':0,'Mercredi_5':0,'Mercredi_6':0,'Mercredi_7':0,'Mercredi_8':0,'Mercredi_9':0,'Mercredi_10':0,'Mercredi_11':0,'Mercredi_12':0,'Mercredi_13':0,'Mercredi_14':0,'Mercredi_15':0,'Mercredi_16':0,'Mercredi_17':0,'Mercredi_18':0,'Mercredi_19':0,'Mercredi_20':0,'Mercredi_21':0,'Mercredi_22':0,'Mercredi_23':0,'Jeudi_0':0,'Jeudi_1':0,'Jeudi_2':0,'Jeudi_3':0,'Jeudi_4':0,'Jeudi_5':0,'Jeudi_6':0,'Jeudi_7':0,'Jeudi_8':0,'Jeudi_9':0,'Jeudi_10':0,'Jeudi_11':0,'Jeudi_12':0,'Jeudi_13':0,'Jeudi_14':0,'Jeudi_15':0,'Jeudi_16':0,'Jeudi_17':0,'Jeudi_18':0,'Jeudi_19':0,'Jeudi_20':0,'Jeudi_21':0,'Jeudi_22':0,'Jeudi_23':0,'Vendredi_0':0,'Vendredi_1':0,'Vendredi_2':0,'Vendredi_3':0,'Vendredi_4':0,'Vendredi_5':0,'Vendredi_6':0,'Vendredi_7':0,'Vendredi_8':0,'Vendredi_9':0,'Vendredi_10':0,'Vendredi_11':0,'Vendredi_12':0,'Vendredi_13':0,'Vendredi_14':0,'Vendredi_15':0,'Vendredi_16':0,'Vendredi_17':0,'Vendredi_18':0,'Vendredi_19':0,'Vendredi_20':0,'Vendredi_21':0,'Vendredi_22':0,'Vendredi_23':0,'Samedi_0':0,'Samedi_1':0,'Samedi_2':0,'Samedi_3':0,'Samedi_4':0,'Samedi_5':0,'Samedi_6':0,'Samedi_7':0,'Samedi_8':0,'Samedi_9':0,'Samedi_10':0,'Samedi_11':0,'Samedi_12':0,'Samedi_13':0,'Samedi_14':0,'Samedi_15':0,'Samedi_16':0,'Samedi_17':0,'Samedi_18':0,'Samedi_19':0,'Samedi_20':0,'Samedi_21':0,'Samedi_22':0,'Samedi_23':0,'Dimanche_0':0,'Dimanche_1':0,'Dimanche_2':0,'Dimanche_3':0,'Dimanche_4':0,'Dimanche_5':0,'Dimanche_6':0,'Dimanche_7':0,'Dimanche_8':0,'Dimanche_9':0,'Dimanche_10':0,'Dimanche_11':0,'Dimanche_12':0,'Dimanche_13':0,'Dimanche_14':0,'Dimanche_15':0,'Dimanche_16':0,'Dimanche_17':0,'Dimanche_18':0,'Dimanche_19':0,'Dimanche_20':0,'Dimanche_21':0,'Dimanche_22':0,'Dimanche_23':0};

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

  getMonthData(){
    return this.monthData;
  }

  getDayData(){
    return this.dayData;
  }
  getHourData(){
    return this.hourData;
  }
  getDayHourData(){
    return this.dayHourData;
  }

  getNomLong(){
    return this.nomLong;
  }

  setDayData(day:string,data:number){
    this.dayData[day]=data;
  }

  setHourData(hour:string,data:number){
    this.hourData[hour]=data;
  }

  setMonthData(month:string,data:number){
    this.monthData[month]=data;
  }

  setDayHourData(day:string,hour:string,data:number){
    this.dayHourData[day+'_'+hour]=data;
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

  clearMonthData(){
    this.monthData={'Janvier':0,'Février':0,'Mars':0,'Avril':0,'Mai':0,'Juin':0,'Juillet':0,'Aout':0,'Septembre':0,'Octobre':0,'Novembre':0,'Décembre':0};
  }

  cleardayData(){
    this.dayData={'Lundi':0,'Mardi':0,'Mercredi':0,'Jeudi':0,'Vendredi':0,'Samedi':0,'Dimanche':0};  
  }
  clearHourData(){
    this.hourData=={0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0};   
  }
  clearDayHourData(){
    this.dayHourData={'Lundi_0':0,'Lundi_1':0,'Lundi_2':0,'Lundi_3':0,'Lundi_4':0,'Lundi_5':0,'Lundi_6':0,'Lundi_7':0,'Lundi_8':0,'Lundi_9':0,'Lundi_10':0,'Lundi_11':0,'Lundi_12':0,'Lundi_13':0,'Lundi_14':0,'Lundi_15':0,'Lundi_16':0,'Lundi_17':0,'Lundi_18':0,'Lundi_19':0,'Lundi_20':0,'Lundi_21':0,'Lundi_22':0,'Lundi_23':0,'Mardi_0':0,'Mardi_1':0,'Mardi_2':0,'Mardi_3':0,'Mardi_4':0,'Mardi_5':0,'Mardi_6':0,'Mardi_7':0,'Mardi_8':0,'Mardi_9':0,'Mardi_10':0,'Mardi_11':0,'Mardi_12':0,'Mardi_13':0,'Mardi_14':0,'Mardi_15':0,'Mardi_16':0,'Mardi_17':0,'Mardi_18':0,'Mardi_19':0,'Mardi_20':0,'Mardi_21':0,'Mardi_22':0,'Mardi_23':0,'Mercredi_0':0,'Mercredi_1':0,'Mercredi_2':0,'Mercredi_3':0,'Mercredi_4':0,'Mercredi_5':0,'Mercredi_6':0,'Mercredi_7':0,'Mercredi_8':0,'Mercredi_9':0,'Mercredi_10':0,'Mercredi_11':0,'Mercredi_12':0,'Mercredi_13':0,'Mercredi_14':0,'Mercredi_15':0,'Mercredi_16':0,'Mercredi_17':0,'Mercredi_18':0,'Mercredi_19':0,'Mercredi_20':0,'Mercredi_21':0,'Mercredi_22':0,'Mercredi_23':0,'Jeudi_0':0,'Jeudi_1':0,'Jeudi_2':0,'Jeudi_3':0,'Jeudi_4':0,'Jeudi_5':0,'Jeudi_6':0,'Jeudi_7':0,'Jeudi_8':0,'Jeudi_9':0,'Jeudi_10':0,'Jeudi_11':0,'Jeudi_12':0,'Jeudi_13':0,'Jeudi_14':0,'Jeudi_15':0,'Jeudi_16':0,'Jeudi_17':0,'Jeudi_18':0,'Jeudi_19':0,'Jeudi_20':0,'Jeudi_21':0,'Jeudi_22':0,'Jeudi_23':0,'Vendredi_0':0,'Vendredi_1':0,'Vendredi_2':0,'Vendredi_3':0,'Vendredi_4':0,'Vendredi_5':0,'Vendredi_6':0,'Vendredi_7':0,'Vendredi_8':0,'Vendredi_9':0,'Vendredi_10':0,'Vendredi_11':0,'Vendredi_12':0,'Vendredi_13':0,'Vendredi_14':0,'Vendredi_15':0,'Vendredi_16':0,'Vendredi_17':0,'Vendredi_18':0,'Vendredi_19':0,'Vendredi_20':0,'Vendredi_21':0,'Vendredi_22':0,'Vendredi_23':0,'Samedi_0':0,'Samedi_1':0,'Samedi_2':0,'Samedi_3':0,'Samedi_4':0,'Samedi_5':0,'Samedi_6':0,'Samedi_7':0,'Samedi_8':0,'Samedi_9':0,'Samedi_10':0,'Samedi_11':0,'Samedi_12':0,'Samedi_13':0,'Samedi_14':0,'Samedi_15':0,'Samedi_16':0,'Samedi_17':0,'Samedi_18':0,'Samedi_19':0,'Samedi_20':0,'Samedi_21':0,'Samedi_22':0,'Samedi_23':0,'Dimanche_0':0,'Dimanche_1':0,'Dimanche_2':0,'Dimanche_3':0,'Dimanche_4':0,'Dimanche_5':0,'Dimanche_6':0,'Dimanche_7':0,'Dimanche_8':0,'Dimanche_9':0,'Dimanche_10':0,'Dimanche_11':0,'Dimanche_12':0,'Dimanche_13':0,'Dimanche_14':0,'Dimanche_15':0,'Dimanche_16':0,'Dimanche_17':0,'Dimanche_18':0,'Dimanche_19':0,'Dimanche_20':0,'Dimanche_21':0,'Dimanche_22':0,'Dimanche_23':0};
  }

  getColor(value,transparency){
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,40%,"+transparency+")"].join("");
  }

  setMonthDataStyle(month:string,min:number,max:number){
        let size = 0;

        if (this.monthData[month]){
          size = (this.monthData[month]-min)/(max-min);
        }
    
        let swapVal = 0.4
    
        size = (size*(1-swapVal))/swapVal
        if (size>1){
          size=1
        }
    
        let transparence = size*3
        if (transparence<0.5){
          transparence=0.5
        }
        if (transparence>1){
          transparence=1
        }
    
        let radSize
    
        if (size*40>20){
          radSize = 20;
        } else {
          radSize=size*40;
        }

        this.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            snapToPixel:false,
            radius: radSize,
            fill: new ol.style.Fill({
              color: this.getColor(1-size,transparence)
            })
          }),
          text: new ol.style.Text({
            //text:this.getMonthData()[month].toString(),
            font: 'Bold 14px  \'lato\''
          })
        }));
  }

  setMonthDataHoveredStyle(month:string,min:number,max:number){
    let size = 0;

    if (this.monthData[month]){
      size = (this.monthData[month]-min)/(max-min);
    }

    let swapVal = 0.4

    size = (size*(1-swapVal))/swapVal
    if (size>1){
      size=1
    }

    let text = 'Arret \' '+this.getNomCommercial()+' \'\n'+this.monthData[month]+' Montées en '+month;
    let textLength = text.length;


    this.dHStyle = new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 3
        }),
        radius: textLength*2.1,
        fill: new ol.style.Fill({
          color: this.getColor(1-size,0.7)
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

  setDayDataStyle(day:string,min:number,max:number){
        let size = 0;

        if (this.dayData[day]){
          size = (this.dayData[day]-min)/(max-min);
        }
    
        let swapVal = 0.4
    
        size = (size*(1-swapVal))/swapVal
        if (size>1){
          size=1
        }
    
        let transparence = size*3
        if (transparence<0.5){
          transparence=0.5
        }
        if (transparence>1){
          transparence=1
        }
    
        let radSize
    
        if (size*40>20){
          radSize = 20;
        } else {
          radSize=size*40;
        }

        this.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            snapToPixel:false,
            radius: radSize,
            fill: new ol.style.Fill({
              color: this.getColor(1-size,transparence)
            })
          }),
          text: new ol.style.Text({
            //text:this.getMonthData()[month].toString(),
            font: 'Bold 14px  \'lato\''
          })
        }));
  }

  setDayDataHoveredStyle(day:string,min:number,max:number){
    let size = 0;

    if (this.dayData[day]){
      size = (this.dayData[day]-min)/(max-min);
    }

    let swapVal = 0.4

    size = (size*(1-swapVal))/swapVal
    if (size>1){
      size=1
    }

    let text = 'Arret \' '+this.getNomCommercial()+' \'\n'+this.dayData[day]+' Montées les '+day+'s';
    let textLength = text.length;


    this.dHStyle = new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 3
        }),
        radius: textLength*2.1,
        fill: new ol.style.Fill({
          color: this.getColor(1-size,0.7)
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


  setHourDataStyle(hour:string,min:number,max:number){
    let size = 0;

    if (this.hourData[hour]){
      size = (this.hourData[hour]-min)/(max-min);
    }

    let swapVal = 0.4

    size = (size*(1-swapVal))/swapVal
    if (size>1){
      size=1
    }

    let transparence = size*3
    if (transparence<0.5){
      transparence=0.5
    }
    if (transparence>1){
      transparence=1
    }

    let radSize

    if (size*40>20){
      radSize = 20;
    } else {
      radSize=size*40;
    }

        this.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            snapToPixel:false,
            radius: radSize,
            fill: new ol.style.Fill({
              color: this.getColor(1-size,transparence)
            })
          }),
          text: new ol.style.Text({
            //text:this.getMonthData()[month].toString(),
            font: 'Bold 14px  \'lato\''
          })
        }));
  }

  setHourDataHoveredStyle(hour:string,min:number,max:number){
    let size = 0;

    if (this.hourData[hour]){
      size = (this.hourData[hour]-min)/(max-min);
    }

    let swapVal = 0.4

    size = (size*(1-swapVal))/swapVal
    if (size>1){
      size=1
    }

    let text = 'Arret \' '+this.getNomCommercial()+' \'\n'+this.hourData[hour]+' Montées à '+hour+'h';
    let textLength = text.length;


    this.dHStyle = new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 3
        }),
        radius: textLength*2.1,
        fill: new ol.style.Fill({
          color: this.getColor(1-size,0.7)
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


  setDayHourDataStyle(day:string,hour:string,min:number,max:number){
        let size = 0;
        if (this.dayHourData[day+'_'+hour]){
          size = (this.dayHourData[day+'_'+hour]-min)/(max-min);
        }

        let swapVal = 0.3

        size = (size*(1-swapVal))/swapVal
        if (size>1){
          size=1
        }

        let transparence = size*3
        if (transparence<0.5){
          transparence=0.5
        }
        if (transparence>1){
          transparence=1
        }

        let radSize

        if (size*40>20){
          radSize = 20;
        } else {
          radSize=size*40;
        }

        
        this.setStyle(new ol.style.Style({
          image: new ol.style.Circle({
            snapToPixel:false,
            radius: radSize,
            fill: new ol.style.Fill({
              color: this.getColor(1-size,transparence)
            })
          }),
          text: new ol.style.Text({
            //text:this.getMonthData()[month].toString(),
            font: 'Bold 14px  \'lato\''
          })
        }));
  }

  setDayHourDataHoveredStyle(day:string,hour:string,min:number,max:number){
    let size = 0;

    if (this.dayHourData[day+'_'+hour]){
      size = (this.dayHourData[day+'_'+hour]-min)/(max-min);
    }

    let swapVal = 0.3

    size = (size*(1-swapVal))/swapVal
    if (size>1){
      size=1
    }

    let text = 'Arret \' '+this.getNomCommercial()+' \'\n'+this.dayHourData[day+'_'+hour]+' Montées,\nles '+day+'s à '+hour+'h';
    let textLength = text.length;


    this.dHStyle = new ol.style.Style({
      image: new ol.style.Circle({
        stroke: new ol.style.Stroke({
          color: '#FFFFFF',
          width: 3
        }),
        radius: textLength*1.8,
        fill: new ol.style.Fill({
          color: this.getColor(1-size,0.7)
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
          color: this.getColor(size,0.9)
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
