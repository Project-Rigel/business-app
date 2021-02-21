import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { User } from '../../interfaces/user';

@Injectable()
export class UserState {
  private user$ = new BehaviorSubject<User>(null);
  private isCordovaPlatform$ = new BehaviorSubject<boolean>(false);

  constructor(
    private firestore: AngularFirestore,
    private fireAuth: AngularFireAuth,
    private platform: Platform,
  ) {
    this.fireAuth.user
      .pipe(
        switchMap(user => {
          if (user) {
            return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        }),
        tap((user: User) => {
          this.setUser(user);
        }),
        take(1),
      )
      .subscribe();
  }

  getUser$() {
    return this.user$.asObservable();
  }

  setUser(user: User) {
    this.user$.next(user);
  }

  isCordova$() {
    this.isCordovaPlatform$.next(this.platform.is('cordova'));
    return this.isCordovaPlatform$.asObservable();
  }
}
