import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';


@Component({
  selector: 'navigationCarte',
  templateUrl: './navigationCarte.component.html',
  styleUrls: ['./navigationCarte.component.scss'],
})

export class NavigationCarte implements OnInit {

  nbYears: number = 5; //Number of years to be represented in the slider
  sliderParams = [0, 11, 0]; //Minimum value, maximum value, and value of the slider
  //@Output() onSliderValueChange: EventEmitter<any> = new EventEmitter();
  sliderValue: number = -1; //Getting the slider value from parent component (app-root)
  minSliderValue: number = this.sliderParams[0]; //minimum slider value
  maxSliderValue: number = this.sliderParams[1]; //maximum slider value
  timerAutoPlay = timer(); //Timer for the autoplay fuctionnality
  timerSub; //Timer subscription
  playing: Boolean = false; //Wether the player is playing or not
  rewinding: Boolean = false; //Wether the player is rewinding or not
  looping: Boolean = false; //Wether the loop option is activated or not
  //navType: number = 0; //navigation type (day, month or year)
  speed: number = 1000; //Navigation speed

  mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  jh=["Lundi_0","Lundi_1","Lundi_2","Lundi_3","Lundi_4","Lundi_5","Lundi_6","Lundi_7","Lundi_8","Lundi_9","Lundi_10","Lundi_11","Lundi_12","Lundi_13","Lundi_14","Lundi_15","Lundi_16","Lundi_17","Lundi_18","Lundi_19","Lundi_20","Lundi_21","Lundi_22","Lundi_23","Mardi_0","Mardi_1","Mardi_2","Mardi_3","Mardi_4","Mardi_5","Mardi_6","Mardi_7","Mardi_8","Mardi_9","Mardi_10","Mardi_11","Mardi_12","Mardi_13","Mardi_14","Mardi_15","Mardi_16","Mardi_17","Mardi_18","Mardi_19","Mardi_20","Mardi_21","Mardi_22","Mardi_23","Mercredi_0","Mercredi_1","Mercredi_2","Mercredi_3","Mercredi_4","Mercredi_5","Mercredi_6","Mercredi_7","Mercredi_8","Mercredi_9","Mercredi_10","Mercredi_11","Mercredi_12","Mercredi_13","Mercredi_14","Mercredi_15","Mercredi_16","Mercredi_17","Mercredi_18","Mercredi_19","Mercredi_20","Mercredi_21","Mercredi_22","Mercredi_23","Jeudi_0","Jeudi_1","Jeudi_2","Jeudi_3","Jeudi_4","Jeudi_5","Jeudi_6","Jeudi_7","Jeudi_8","Jeudi_9","Jeudi_10","Jeudi_11","Jeudi_12","Jeudi_13","Jeudi_14","Jeudi_15","Jeudi_16","Jeudi_17","Jeudi_18","Jeudi_19","Jeudi_20","Jeudi_21","Jeudi_22","Jeudi_23","Vendredi_0","Vendredi_1","Vendredi_2","Vendredi_3","Vendredi_4","Vendredi_5","Vendredi_6","Vendredi_7","Vendredi_8","Vendredi_9","Vendredi_10","Vendredi_11","Vendredi_12","Vendredi_13","Vendredi_14","Vendredi_15","Vendredi_16","Vendredi_17","Vendredi_18","Vendredi_19","Vendredi_20","Vendredi_21","Vendredi_22","Vendredi_23","Samedi_0","Samedi_1","Samedi_2","Samedi_3","Samedi_4","Samedi_5","Samedi_6","Samedi_7","Samedi_8","Samedi_9","Samedi_10","Samedi_11","Samedi_12","Samedi_13","Samedi_14","Samedi_15","Samedi_16","Samedi_17","Samedi_18","Samedi_19","Samedi_20","Samedi_21","Samedi_22","Samedi_23","Dimanche_0","Dimanche_1","Dimanche_2","Dimanche_3","Dimanche_4","Dimanche_5","Dimanche_6","Dimanche_7","Dimanche_8","Dimanche_9","Dimanche_10","Dimanche_11","Dimanche_12","Dimanche_13","Dimanche_14","Dimanche_15","Dimanche_16","Dimanche_17","Dimanche_18","Dimanche_19","Dimanche_20","Dimanche_21","Dimanche_22","Dimanche_23"];


  constructor(private gestionLigneArret:GestionLigneArret){

  }

  ngOnInit() {

    this.gestionLigneArret.getArretsSetOBS().subscribe(l=>{
      if(l==='jour'){
        this.maxSliderValue=6;
      }
      if(l==='mois'){
        this.maxSliderValue=11;
      }
      if(l==='heure'){
        this.maxSliderValue=23;
      }
      if(l==='jourHeure'){
        this.maxSliderValue=167;
      }
    });
    this.gestionLigneArret.fetchMgtSpeedObs.subscribe(tFiltre => {
      this.speed=tFiltre;
      if(this.playing){
        this.pauseButtonClick();
        this.playButtonClick(this.speed);
      }
      if(this.rewinding){
        this.pauseButtonClick();
        this.rewButtonClick(this.speed);
      }
    });
  }

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
  }

  //Pause button on click event
  pauseButtonClick() {
    this.playing = false;
    this.rewinding = false;
  }

}