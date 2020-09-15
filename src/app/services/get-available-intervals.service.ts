import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';
import { functionNames } from '../constants';

export interface GetAvailableTimesDto {
  businessId: string;
  agendaId: string;
  productId: string;
  timestamp: string;
}

export interface AvailableTimesResponse {
  result: { from: string; to: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class GetAvailableIntervalsService {
  private readonly _endpoint: (
    data: GetAvailableTimesDto,
  ) => Observable<AvailableTimesResponse>;

  constructor(private functions: AngularFireFunctions) {
    this._endpoint = this.functions.httpsCallable<
      GetAvailableTimesDto,
      AvailableTimesResponse
    >(functionNames.avaliableTimeIntervals);
  }

  get endpoint() {
    return this._endpoint;
  }
}
