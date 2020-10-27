import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from '../../interfaces/user';

@Injectable()
export class ProfileApiService {
  constructor(private firestore: AngularFirestore) {}

  public getProfileData(userId: string): Observable<User> {
    return this.firestore
      .doc<User>(`users/${userId}`)
      .valueChanges()
      .pipe(take(1));
  }
}
