import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {NavigationCarte} from './navigationCarte/navigationCarte.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconRegistry} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DomSanitizer} from '@angular/platform-browser';
import { MapComponent } from './map/map.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { OlmapComponent } from './olmap/olmap.component';
import { HttpClientModule } from '@angular/common/http';
import { DataConService } from './services/data-con.service';
import { SidenavFiltersComponent } from './sidenav-filters/sidenav-filters.component';
import { GestionLigneArret } from './Model/gestion-ligne-arret.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationCarte,
    MapComponent,
    OlmapComponent,
    SidenavFiltersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA1d9oo9_e1cXgQxfXDd8Iohor7Tlqt3r4'
    })

  ],
  providers: [
    DataConService,GestionLigneArret
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  

    constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
      matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/matIcons/mdi.svg'));
    }

 }
