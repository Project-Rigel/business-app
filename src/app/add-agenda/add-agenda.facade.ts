import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddAgendaState } from './add-agenda.state';

@Injectable()
export class AddAgendaFacade {
  constructor(private addAgendaState: AddAgendaState) {}

  isUpdating$(): Observable<boolean> {
    return this.addAgendaState.isUpdating$();
  }

  /*loadAgendas$() {
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
  }*/
}
