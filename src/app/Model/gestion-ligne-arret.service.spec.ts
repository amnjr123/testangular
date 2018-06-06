import { TestBed, inject } from '@angular/core/testing';

import { GestionLigneArret } from './gestion-ligne-arret.service';

describe('GestionLigneArretService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GestionLigneArret]
    });
  });

  it('should be created', inject([GestionLigneArret], (service: GestionLigneArret) => {
    expect(service).toBeTruthy();
  }));
});
