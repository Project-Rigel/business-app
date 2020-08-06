import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Agenda } from '../interfaces/agenda';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  constructor(private firestore: AngularFirestore) {}

  async addAgenda(
    id: string,
    name: string,
    minuteSelected: string,
    downloadUrl: string,
    businessId: string,
  ) {
    const agenda: Agenda = {
      id: id,
      name: name,
      interval: minuteSelected,
      imageUrl: downloadUrl,
      businessId: businessId,
      intervals: {},
    };

    await this.firestore
      .collection('agendas')
      .doc(`${id}`)
      .set(agenda);
  }

  getBusinessAgenda(businessId: string): Observable<Agenda[]> {
    return this.firestore
      .collection<Agenda>('agendas', ref => {
        return ref.where('businessId', '==', businessId);
      })
      .valueChanges();
  }

  getAgendaById(id: string) {
    return this.firestore.doc<Agenda>(`agendas/${id}`).valueChanges();
  }
}
