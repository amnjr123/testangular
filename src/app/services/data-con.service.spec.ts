import { TestBed, inject } from '@angular/core/testing';

import { DataConService } from './data-con.service';

describe('DataConService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataConService]
    });
  });

  it('should be created', inject([DataConService], (service: DataConService) => {
    expect(service).toBeTruthy();
  }));
});
