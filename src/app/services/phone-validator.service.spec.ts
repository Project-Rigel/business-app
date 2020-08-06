import { TestBed } from '@angular/core/testing';
import { PhoneValidatorService } from './phone-validator.service';

describe('PhoneValidatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhoneValidatorService = TestBed.get(PhoneValidatorService);
    expect(service).toBeTruthy();
  });
});
