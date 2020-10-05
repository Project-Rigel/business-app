import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { FunctionNames } from '../constants';
import { Interval } from '../interfaces/interval';

export interface Config {
  expirationDate: string;
  specificDate: string;
  dayOfWeek: string;
  intervals: Interval[];
}

export interface SetAgendaConfigDTO {
  agendaId: string;
  businessId: string;
  dayOfWeek: string;
  specificDate: string;
  expirationDate: string;
  intervals: Interval[];
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
export class SetAgendaConfigService {
  private readonly _endpoint: (
    data: SetAgendaConfigDTO,
  ) => Observable<SetAgendaConfigResponse>;

  constructor(private functions: AngularFireFunctions) {
    this._endpoint = this.functions.httpsCallable<
      SetAgendaConfigDTO,
      SetAgendaConfigResponse
    >(FunctionNames.SET_AGENDA_CONFIG);
  }

  get endpoint() {
    return this._endpoint;
  }
}
