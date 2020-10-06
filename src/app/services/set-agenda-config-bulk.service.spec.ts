import { TestBed } from '@angular/core/testing';
import { SetAgendaConfigService } from './set-agenda-config-bulk.service';

describe('SetAgendaConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetAgendaConfigService = TestBed.get(SetAgendaConfigService);
    expect(service).toBeTruthy();
  });
});
