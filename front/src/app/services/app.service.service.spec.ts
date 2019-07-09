import { TestBed, inject } from '@angular/core/testing';

import { AppService } from './app.service.service';

describe('App.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService]
    });
  });

  it('should be created', inject([AppService], (service: AppService) => {
    expect(service).toBeTruthy();
  }));
});
