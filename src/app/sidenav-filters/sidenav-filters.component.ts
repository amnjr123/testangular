import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GestionLigneArret } from '../Model/gestion-ligne-arret.service';
import { Ligne } from '../Model/ligne';
import { Arret } from '../Model/arret';
import { Observable } from 'openlayers';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-sidenav-filters',
  templateUrl: './sidenav-filters.component.html',
  styleUrls: ['./sidenav-filters.component.scss']
})
export class SidenavFiltersComponent implements OnInit {

  step = 0;
  allLines = false;
  arretsSelectionType = 'selectedLines';
  @Input() drawer;
  ligneTFc: FormControl;
  ligneBFc: FormControl;
  arretFc: FormControl;
  moisFc: FormControl;
  jourFc: FormControl;
  lignes: Array<Ligne>;
  arrets: Array<Arret>;
  annees: Array<string>;
  mois: Array<string> = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"];
  jours: Array<string> = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  selectedBusLines:Array<Ligne>=new Array<Ligne>();
  selectedTramLines:Array<Ligne>=new Array<Ligne>();
  selectedStops:Array<Arret>=new Array<Arret>();
  selectedLinesStops:Array<Arret>=new Array<Arret>();
  selectedDays:Array<string>=new Array<string>();
  selectedMonths:Array<string>=new Array<string>();
  selectedYear:string='2017';
  speed=700;

  
  constructor(private gestionLigneArret: GestionLigneArret) {
    this.ligneTFc = new FormControl();
    this.ligneBFc = new FormControl();
    this.arretFc = new FormControl();
    this.moisFc = new FormControl();
    this.jourFc = new FormControl();
    this.lignes = this.gestionLigneArret.getLignes();
    this.arrets = this.gestionLigneArret.getArrets();
    this.annees = this.gestionLigneArret.getAnnees();
  }

  ngOnInit() {
    
  }

  isTram(ligne:Ligne){
    if (ligne.getType()==="Tram" && ligne.getSens()===1){
      return true
    } else return false;
  }
  isBus(ligne:Ligne){
    if (ligne.getType()==="Bus" && ligne.getSens()===1){
      return true
    } else return false;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  checkLineOptions(): Boolean {
    if (this.allLines) {
      this.arretsSelectionType = 'all';
    }
    return this.allLines;
  }

  resetSelectedBus(){
    this.selectedBusLines=[];
  }
  resetSelectedTram(){
    this.selectedTramLines=[];
  }
  resetSelectedStops(){
    this.selectedStops=[];
  }
  allDays(){
    this.selectedDays=this.jours;
  }
  clearDays(){
    this.selectedDays=[];
  }
  allMonths(){
    this.selectedMonths=this.mois;
  }
  clearMonths(){
    this.selectedMonths=[];
  }

  setSelectedLinesStops(){
    this.selectedLinesStops=new Array<Arret>();
    this.selectedBusLines.forEach(line=>{
      line.getArrets().forEach(stop => {
        this.selectedLinesStops.push(stop);
      });
    });
    this.selectedTramLines.forEach(line=>{
      line.getArrets().forEach(stop => {
        this.selectedLinesStops.push(stop);
      });
    });
    console.log(this.selectedLinesStops);
  }

  getData(){

    //console.log(this.gestionLigneArret.getSelectedLines());
    //console.log(this.gestionLigneArret.getSelectedStops()); 

    this.gestionLigneArret.fetchMgtSpeedObs.next(this.speed);

    if (this.allLines){
      //Toutes les lignes
      if (this.arretsSelectionType==="all"){
        //Toutes les lignes, tout les arrets
        this.gestionLigneArret.setSelectedStops(this.gestionLigneArret.getArrets());
        this.gestionLigneArret.setSelectedLines(this.gestionLigneArret.getLignes());
        this.gestionLigneArret.fetchDataObs.next("allLinesAllStops");

      } else if (this.arretsSelectionType==="pers") {
        //Toutes les lignes, arrets personnalisés
        this.gestionLigneArret.setSelectedStops(this.selectedStops);
        this.gestionLigneArret.setSelectedLines(this.gestionLigneArret.getLignes());
        this.gestionLigneArret.fetchDataObs.next("allLinesPersStops");
      }
    } else {
      //Selecion personnalisee de lignes
      if (this.arretsSelectionType==="all"){
        //Lignes Perso, tout les arrets
        this.gestionLigneArret.setSelectedStops(this.gestionLigneArret.getArrets());
        this.gestionLigneArret.setSelectedLines([ ...this.selectedBusLines, ...this.selectedTramLines]);
        this.gestionLigneArret.fetchDataObs.next("persLinesAllStops");

      } else if (this.arretsSelectionType==="pers") {
        //Lignes perso, arrets selectionnes
        this.gestionLigneArret.setSelectedStops(this.selectedStops);
        this.gestionLigneArret.setSelectedLines([ ...this.selectedBusLines, ...this.selectedTramLines]);
        this.gestionLigneArret.fetchDataObs.next("persLinesPersStops");

      } else if (this.arretsSelectionType==="selectedLines"){
        //Lignes perso, arrets des lignes
        this.gestionLigneArret.setSelectedStops(null);
        this.gestionLigneArret.setSelectedLines([ ...this.selectedBusLines, ...this.selectedTramLines]);
        this.gestionLigneArret.fetchDataObs.next("persLinesSelectedLinesStops");

      }
    }

    this.gestionLigneArret.fetchData(this.selectedYear,this.selectedStops,'jour',this.selectedDays,this.selectedMonths);

  }

}
