import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Agenda } from '../../interfaces/agenda';

@Injectable()
export class AgendaListApiService {
  private FETCH_AGENDAS_LIMIT = 10;
  constructor(private firestore: AngularFirestore) {}

  public getAgendasList(businessId: string): Observable<Agenda[]> {
    return this.firestore
      .collection<Agenda>('agendas', ref => {
        return ref
          .where('businessId', '==', businessId)
          .limit(this.FETCH_AGENDAS_LIMIT);
      })
      .valueChanges();
  }
}
