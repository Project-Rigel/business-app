import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/performance';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Business } from '../interfaces/business';
import { User } from '../interfaces/user';
import { BusinessService } from './business.service';
import { ErrorToastService } from './error-toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  temporalUser;
  verificationId: string;

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore,
    private router: Router,
    private errorToastService: ErrorToastService,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private firebaseAuth: FirebaseAuthentication,
    private businessService: BusinessService,
  ) {
    if (this.platform.is('cordova')) {
      this.googlePlus
        .trySilentLogin({
          offline: false,
        })
        .then(res => console.log(res));
    }

    this.user$ = this.fireAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          this.temporalUser = user;
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      }),
    );
  }

  async loginWithGoogle(): Promise<boolean> {
    return new Promise(async resolve => {
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
        await this.updateUserData(credential.user).then(isANewUser => {
          resolve(isANewUser);
        });
      } catch (e) {
        console.error(e);
        await this.errorToastService.present({ message: e.message });
        throw e;
      }
    });
  }

  sendPhoneVerificationCode(phoneNumber: string) {
    console.log(this.platform.platforms());
    console.log(this.platform);
    if (this.platform.is('cordova')) {
      this.firebaseAuth
        .verifyPhoneNumber(phoneNumber, 3000)
        .then(verificationId => {
          this.verificationId = verificationId;
        });
    } else {
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        },
      );
      const provider = new firebase.auth.PhoneAuthProvider();
      provider
        .verifyPhoneNumber(phoneNumber, recaptchaVerifier)
        .then(verificationId => {
          this.verificationId = verificationId;
        });
    }
  }

  verifyPhoneNumber(code: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        code,
      );
      firebase
        .auth()
        .currentUser.linkWithCredential(credential)
        .then(result => {
          console.log(result);
          resolve(true);
        })
        .catch(err => {
          resolve(false);
        });
    });
  }

  async login(email: string, password: string) {
    await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  async createUser(email: string, password: string): Promise<boolean> {
    return new Promise(async resolve => {
      try {
        const credential = await this.fireAuth.createUserWithEmailAndPassword(
          email,
          password,
        );
        await this.updateUserData(credential.user).then(isANewUser => {
          resolve(isANewUser);
        });
      } catch (e) {
        await this.errorToastService.present({ message: e.message });
        throw e;
      }
    });
  }

  async logOut() {
    try {
      if (this.platform.is('cordova')) {
        await this.googlePlus.logout();
      }
      await this.fireAuth.signOut();
      await this.router.navigate(['/login']);
    } catch (e) {
      await this.errorToastService.present({ message: e.message });
      throw e;
    }
  }

  private updateUserData(user): Promise<boolean> {
    return new Promise(resolve => {
      // Sets user data to firestore on login
      const userRef: AngularFirestoreDocument<User> = this.firestore.doc(
        `users/${user.uid}`,
      );

      // Sets businessId depending of the user existance in the database
      userRef.ref.get().then(doc => {
        if (!doc.exists) {
          const businessId = this.firestore.createId();
          this.businessService.setBusinessId(businessId);
          const data = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            avatar: user.photoURL,
            customers: [],
            businessId: businessId,
          };
          userRef.set(data, { merge: true });
          resolve(true); // New user
        } else {
          resolve(false); // User already exists
        }
      });
    });
  }

  deleteCurrentUser() {
    this.deleteUserData(this.temporalUser.uid);
    this.temporalUser.delete().then(() => console.log('Borrado de Auth'));
  }

  deleteUserData(userId: string) {
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(
      `users/${userId}`,
    );
    userRef.delete().then(() => console.log('Borrado de la base de datos'));
  }

  saveBusiness(data: Business) {
    this.businessService.addBusiness(data);
  }
}
