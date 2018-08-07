import { Component, OnInit } from '@angular/core';
import * as ol from 'openlayers';

@Component({
  selector: 'app-olheatmap',
  templateUrl: './olheatmap.component.html',
  styleUrls: ['./olheatmap.component.scss']
})
export class OlheatmapComponent implements OnInit {


  vector = new ol.layer.Heatmap({
    source: new ol.source.Vector({
      url: 'data/kml/2012_Earthquakes_Mag5.kml',
      format: new ol.format.KML({
        extractStyles: false
      })
    }),
    weight:'1',
    blur:5,
    radius: 10
  });

  raster = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'toner'
    })
  });
  hmap;




  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.hmap = new ol.Map({
      layers: [this.raster, this.vector],
      target: 'hmap',
      view: new ol.View({
        center: ol.proj.fromLonLat([0.68, 47.38]),
        zoom: 12
      })
    });
  }

}
