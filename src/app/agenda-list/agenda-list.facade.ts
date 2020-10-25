import { Injectable } from '@angular/core';
import { AgendaListApiService } from './services/agenda-list-api.service';
import { AgendaListState } from './agenda-list.state';
import { Observable } from 'rxjs';
import { Agenda } from '../interfaces/agenda';
import { UserState } from '../shared/state/user.state';
import { switchMap, tap } from 'rxjs/operators';

@Injectable()
export class AgendaListFacade{
  constructor(private readonly agendaListApiService: AgendaListApiService, private agendaListState: AgendaListState, private userState: UserState) {
  }

  isUpdating$(): Observable<boolean>{
    return this.agendaListState.isUpdating$();
  }

  getAgendaList$(): Observable<Agenda[]> {
    return this.agendaListState.getAgendas$();
  }

  loadAgendas$(){
    return this.userState.getUser$().pipe(switchMap(user => this.agendaListApiService.getAgendasList(user.businessId).pipe(tap(agendas => this.agendaListState.setAgendas(agendas)))))
  }

}
