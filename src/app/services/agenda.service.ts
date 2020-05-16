import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Agenda } from '../interfaces/agenda';
import { Observable } from 'rxjs';

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
    businessId: string
  ) {
    const agenda: Agenda = {
      id: id,
      name: name,
      interval: minuteSelected,
      imageUrl: downloadUrl,
      businessId: businessId
    };

    await this.firestore
      .collection('agendas')
      .doc(`${id}`)
      .set(agenda);
  }

    getAgendas(id: string): Observable<Agenda[]>{
    return this.firestore.collection<Agenda>("agendas", ref =>{
      return ref.where("businessId", "==", id);
    }).valueChanges();
  }
}
