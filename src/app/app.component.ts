import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injector, Inject } from '@angular/core';
import { GestionLigneArret } from './Model/gestion-ligne-arret.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Test Sgi';

  constructor() {
  }

  ngOnInit() {
    
  }

  sliderValueChanged(newValue: number) {
    //this.sv=newValue;
    console.log("new value = " + newValue);
  }


  ngAfterViewInit() {
    
  }

}
