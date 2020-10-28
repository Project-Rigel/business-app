import { Injectable } from "@angular/core";
import { AgendaListApiService } from "./services/agenda-list-api.service";
import { AgendaListState } from "./agenda-list.state";
import { Observable } from "rxjs";
import { Agenda } from "../interfaces/agenda";
import { UserState } from "../core/user/user.state";
import { distinctUntilChanged, filter, switchMap, tap } from "rxjs/operators";
import { User } from "../interfaces/user";

@Injectable()
export class AgendaListFacade {
  constructor(
    private readonly agendaListApiService: AgendaListApiService,
    private agendaListState: AgendaListState,
    private userState: UserState
  ) {
  }

  isUpdating$(): Observable<boolean> {
    return this.agendaListState.isUpdating$();
  }

  getAgendaList$(): Observable<Agenda[]> {
    return this.agendaListState.getAgendas$();
  }

  loadAgendas$() {
    return this.userState.getUser$().pipe(
      filter(user => user !== null),
      distinctUntilChanged(),
      switchMap((user: User) => {
        return this.agendaListApiService
          .getAgendasList(user.businessId)
          .pipe(tap(agendas => {
            this.agendaListState.setAgendas(agendas);
          }));
      })
    );
  }
}
