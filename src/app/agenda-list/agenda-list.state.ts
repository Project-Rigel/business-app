import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Agenda } from '../interfaces/agenda';

@Injectable()
export class AgendaListState{

  private updating$ = new BehaviorSubject<boolean>(false);
  private agendas$ = new BehaviorSubject<Agenda[]>(null);

  isUpdating$(){
    return this.updating$.asObservable();
  }

  setUpdating$(isUpdating: boolean){
    this.updating$.next(isUpdating);
  }

  getAgendas$(){
    return this.agendas$.asObservable();
  }

  setAgendas(agendas: Agenda[]){
    this.agendas$.next(agendas);
  }
}
