import { TestBed, inject } from '@angular/core/testing';

import { Arret } from './arret.service';

describe('ArretService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Arret]
    });
  });

  it('should be created', inject([Arret], (service: Arret) => {
    expect(service).toBeTruthy();
  }));
});
