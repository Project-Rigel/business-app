import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/performance';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { ErrorToastService } from './error-toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore,
    private router: Router,
    private errorToastService: ErrorToastService,
    private platform: Platform,
    private googlePlus: GooglePlus,
  ) {
    this.user$ = this.fireAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      }),
    );
  }

  async loginWithGoogle() {
    try {
      let credential;
      if (this.platform.is('cordova')) {
        const gPlusUser = await this.googlePlus.login({
          webClientId:
            '457735200635-lfp1rpnghsuu4hodv0pr0gac6cf48spr.apps.googleusercontent.com',
          offline: true,
          scopes: 'profile email',
        });
        credential = await this.fireAuth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(gPlusUser.idToken),
        );
      } else {
        credential = await this.fireAuth.signInWithPopup(
          new firebase.auth.GoogleAuthProvider(),
        );
      }
      await this.updateUserData(credential.user);
    } catch (e) {
      console.error(e);
      await this.errorToastService.present({ message: e.message });
      throw e;
    }
  }

  async login(email: string, password: string) {
    await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  async createUser(email: string, password: string) {
    try {
      const credential = await this.fireAuth.createUserWithEmailAndPassword(
        email,
        password,
      );
      await this.updateUserData(credential.user);
    } catch (e) {
      await this.errorToastService.present({ message: e.message });
      throw e;
    }
  }

  async logOut() {
    try {
      if (this.platform.is('cordova')) {
        await this.googlePlus.logout();
      }
      await this.fireAuth.signOut();
      await this.router.navigate(['/']);
    } catch (e) {
      await this.errorToastService.present({ message: e.message });
      throw e;
    }
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(
      `users/${user.uid}`,
    );

    const businessId = this.firestore.createId();

    const data = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      avatar: user.photoURL,
      customers: [],
      businessId: businessId,
    };

    return userRef.set(data, { merge: true });
  }
}
