import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { timer } from 'rxjs/observable/timer';


@Component({
  selector: 'navigationCarte',
  templateUrl: './navigationCarte.component.html',
  styleUrls: ['./navigationCarte.component.scss'],
})

export class NavigationCarte implements OnInit {

  nbYears: number = 5; //Number of years to be represented in the slider
  sliderParams = [0, 11, 0]; //Minimum value, maximum value, and value of the slider
  //@Output() onSliderValueChange: EventEmitter<any> = new EventEmitter();
  sliderValue: number = 0; //Getting the slider value from parent component (app-root)
  minSliderValue: number = this.sliderParams[0]; //minimum slider value
  maxSliderValue: number = this.sliderParams[1]; //maximum slider value
  timerAutoPlay = timer(); //Timer for the autoplay fuctionnality
  timerSub; //Timer subscription
  playing: Boolean = false; //Wether the player is playing or not
  rewinding: Boolean = false; //Wether the player is rewinding or not
  looping: Boolean = false; //Wether the loop option is activated or not
  navType: number = 0; //navigation type (day, month or year)
  speed: number = 1000; //Navigation speed


  ngOnInit() {

  }

  //Emits a notification when the slider value is changed
  //sliderValueChangeEvent() {
  //this.onSliderValueChange.emit(this.sliderValue);
  //}

  //Format the slider label
  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }

    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  //Slider value setter
  setSliderValue(v: number) {
    this.sliderValue = v;
    //this.sliderValueChangeEvent;
  }

  //navigation types (day, month, year) setter
  setNavType(v: number) {
    if (v = 0) {
      this.maxSliderValue = 365 * this.nbYears;
      this.minSliderValue = 0;
    } else if (v = 1) {
      this.maxSliderValue = 12 * this.nbYears;
      this.minSliderValue = 0;
    } else if (v = 2) {
      this.maxSliderValue = 1 * this.nbYears;
      this.minSliderValue = 0;
    }
  }

  //Play button on click event
  playButtonClick(v: number) {
    this.rewinding = false;
    this.timerAutoPlay = timer(0, v);
    this.playing = true;
    try { this.timerSub.unsubscribe(); } catch { console.log("timer already unsubscribed"); }
    this.timerSub = this.timerAutoPlay.subscribe(x => this.autoplay());
  }

  //Autoplay slider
  autoplay() {
    //console.log("sliderValue = " + this.sliderValue)
    if (this.playing) {
      if (this.sliderValue < this.maxSliderValue) {
        this.sliderValue++;
        //this.notify.emit(this.sliderValue);
      } else if (this.looping) {
        this.sliderValue = 0;
      } else {
        //this.sliderValue = 0;
        this.playing = false;
        this.timerSub.unsubscribe();
      }
    } else {
      this.playing = false;
      this.timerSub.unsubscribe();
    }
    //this.sliderValueChangeEvent;
  }

  rewButtonClick(v: number) {
    this.playing = false;
    this.timerAutoPlay = timer(0, v);
    this.rewinding = true;
    try { this.timerSub.unsubscribe(); } catch { console.log("timer already unsubscribed"); }
    this.timerSub = this.timerAutoPlay.subscribe(x => this.autoRew());
  }

  autoRew() {
    //console.log("sliderValue = " + this.sliderValue)
    if (this.rewinding) {
      if (this.sliderValue > this.minSliderValue) {
        this.sliderValue--;
      } else if (this.looping) {
        this.sliderValue = this.maxSliderValue;
      } else {
        //this.sliderValue = 0;
        this.rewinding = false;
        this.timerSub.unsubscribe();
      }
    } else {
      this.rewinding = false;
      this.timerSub.unsubscribe();
    }
    //this.sliderValueChangeEvent;
  }

  //Pause button on click event
  pauseButtonClick() {
    this.playing = false;
    this.rewinding = false;
  }
}