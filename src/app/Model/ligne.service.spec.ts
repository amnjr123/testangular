import { TestBed, inject } from '@angular/core/testing';

import { Ligne } from './ligne.service';

describe('LigneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Ligne]
    });
  });

  it('should be created', inject([Ligne], (service: Ligne) => {
    expect(service).toBeTruthy();
  }));
});
