import { TestBed } from '@angular/core/testing';
import { GetAgendaConfigService } from './get-agenda-config.service';

describe('GetAgendaConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetAgendaConfigService = TestBed.get(GetAgendaConfigService);
    expect(service).toBeTruthy();
  });
});
