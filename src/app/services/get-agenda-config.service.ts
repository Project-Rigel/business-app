import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { FunctionNames } from '../constants';
import { Interval } from '../interfaces/interval';

export interface GetAgendaConfigDTO {
  agendaId: string;
  businessId: string;
  showOnlyValidConfig: boolean;
}

export interface GetAgendaConfigResponse {
  result: {
    expirationDate: string;
    specificDate: string;
    dayOfWeek: number;
    intervals: Interval[];
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class GetAgendaConfigService {
  private readonly _endpoint: (
    data: GetAgendaConfigDTO,
  ) => Observable<GetAgendaConfigResponse>;

  constructor(private functions: AngularFireFunctions) {
    this._endpoint = this.functions.httpsCallable<
      GetAgendaConfigDTO,
      GetAgendaConfigResponse
    >(FunctionNames.GET_AGENDA_CONFIG);
  }

  get endpoint() {
    return this._endpoint;
  }
}
