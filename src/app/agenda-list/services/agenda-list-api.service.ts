import { Injectable } from '@angular/core';
import { Agenda } from '../../interfaces/agenda';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class AgendaListApiService{
  constructor(private firestore: AngularFirestore) {}

  public getAgendasList(businessId: string): Observable<Agenda[]>{
      return this.firestore
        .collection<Agenda>('agendas', ref => {
          return ref.where('businessId', '==', businessId);
        }).valueChanges().pipe(take(1));
    }

}
