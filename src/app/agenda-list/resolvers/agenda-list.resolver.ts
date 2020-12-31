import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Agenda } from '../../interfaces/agenda';
import { AgendaListFacade } from '../agenda-list.facade';

@Injectable()
export class AgendaListResolver implements Resolve<Agenda[]> {
  constructor(private settingsFacade: AgendaListFacade) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Agenda[]> {
    return this.settingsFacade.loadAgendas$().pipe(
      tap(() => console.log('hello')),
      take(1),
    );
  }
}
