import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Test Sgi';
  //public sv: number =0;

  ngOnInit() {
    console.log("onInit app Component");
  }
  
  sliderValueChanged(newValue: number){
    //this.sv=newValue;
    console.log("new value = "+newValue);
  }

}
