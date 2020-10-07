import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { FunctionNames } from '../constants';
import { Interval } from '../interfaces/interval';

export class Config {
  expirationDate: string;
  specificDate: string;
  dayOfWeek: string;
  intervals: Interval[];
}

export interface SetAgendaConfigBulkDTO {
  agendaId: string;
  businessId: string;
  configs: Config[];
}

export interface SetAgendaConfigResponse {
  result: {
    agendaId: string;
    businessId: string;
    config: Config[];
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class SetAgendaConfigBulkService {
  private readonly _endpoint: (
    data: SetAgendaConfigBulkDTO,
  ) => Observable<SetAgendaConfigResponse>;

  constructor(private functions: AngularFireFunctions) {
    this._endpoint = this.functions.httpsCallable<
      SetAgendaConfigBulkDTO,
      SetAgendaConfigResponse
    >(FunctionNames.SET_AGENDA_CONFIG_BULK);
  }

  get endpoint() {
    return this._endpoint;
  }
}
