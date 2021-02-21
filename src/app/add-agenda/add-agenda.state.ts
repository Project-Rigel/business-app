import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AddAgendaState {
  private updating$ = new BehaviorSubject<boolean>(false);

  isUpdating$() {
    return this.updating$.asObservable();
  }

  setUpdating$(isUpdating: boolean) {
    this.updating$.next(isUpdating);
  }
}
