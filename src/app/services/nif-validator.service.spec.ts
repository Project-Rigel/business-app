import { TestBed } from '@angular/core/testing';
import { NifValidatorService } from './nif-validator.service';

describe('NifValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NifValidatorService = TestBed.get(NifValidatorService);
    expect(service).toBeTruthy();
  });
});
