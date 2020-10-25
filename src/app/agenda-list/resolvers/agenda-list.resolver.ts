import { Injectable } from '@angular/core';
import { Agenda } from '../../interfaces/agenda';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AgendaListFacade } from '../agenda-list.facade';

@Injectable()
export class AgendaListResolver implements Resolve<Agenda[]> {

  constructor(private settingsFacade: AgendaListFacade) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Agenda[]> {
    return this.settingsFacade.loadAgendas$();
  }

}
