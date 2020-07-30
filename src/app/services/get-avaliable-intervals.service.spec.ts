import { TestBed } from '@angular/core/testing';

import { GetAvailableIntervalsService } from './get-available-intervals.service';

describe('GetAvaliableIntervalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAvailableIntervalsService = TestBed.get(
      GetAvailableIntervalsService,
    );
    expect(service).toBeTruthy();
  });
});
