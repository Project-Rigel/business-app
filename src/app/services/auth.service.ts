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
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/performance';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { UserState } from '../core/user/user.state';
import { Business } from '../interfaces/business';
import { User } from '../interfaces/user';
import { BusinessService } from './business.service';
import { ErrorToastService } from './error-toast.service';

@Injectable()
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
    private state: UserState,
  ) {
    if (this.platform.is('cordova')) {
      this.googlePlus.trySilentLogin({
        offline: false,
      });
    }

    this.user$ = this.fireAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          console.log(user);
          this.temporalUser = user;
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          console.log('out');
          return of(null);
        }
      }),
      tap(user => {
        this.state.setUser(user);
      }),
    );
  }

  async loginWithGoogle(): Promise<boolean> {
    try {
      let credential: firebase.auth.UserCredential;
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
      await this.createUserInFirebaseIfNew(credential.user);
      return credential.additionalUserInfo.isNewUser;
    } catch (e) {
      console.error(e);
      await this.errorToastService.present({ message: e.message });
      throw e;
    }
  }

  async sendPhoneVerificationCode(phoneNumber: string) {
    if (this.platform.is('cordova')) {
      this.verificationId = await this.firebaseAuth.verifyPhoneNumber(
        phoneNumber,
        3000,
      );
    } else {
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
        },
      );
      const provider = new firebase.auth.PhoneAuthProvider();
      this.verificationId = await provider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier,
      );
    }
  }

  async verifyPhoneNumber(code: string): Promise<void> {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        this.verificationId,
        code,
      );
      await firebase.auth().currentUser.linkWithCredential(credential);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async login(email: string, password: string) {
    await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  async createUserIfNewOrUpdate(
    email: string,
    password: string,
  ): Promise<{ user: any; isNewUser: boolean }> {
    try {
      const credential = await this.fireAuth.createUserWithEmailAndPassword(
        email,
        password,
      );
      const user = await this.createUserInFirebaseIfNew(credential.user);
      return { user: user, isNewUser: credential.additionalUserInfo.isNewUser };
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
      await this.router.navigate(['/login']);
    } catch (e) {
      await this.errorToastService.present({ message: e.message });
      throw e;
    }
  }

  private async createUserInFirebaseIfNew(user: any): Promise<User> {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(
      `users/${user.uid}`,
    );

    // Sets businessId depending of the user existance in the database
    const firebaseData = await userRef.ref.get();

    const appUser: User = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      avatar: user.photoURL,
      customers: [],
      businessId: '',
    };

    if (!firebaseData.exists) {
      const businessId = this.firestore.createId();
      this.businessService.setBusinessId(businessId);
      appUser.businessId = businessId;

      await userRef.set(appUser, { merge: true });
    }

    return appUser;
  }

  deleteCurrentUser() {
    this.deleteUserData(this.temporalUser.uid);
    this.temporalUser.delete();
  }

  deleteUserData(userId: string) {
    const userRef: AngularFirestoreDocument<User> = this.firestore.doc(
      `users/${userId}`,
    );
    userRef.delete();
  }

  async saveBusiness(data: Business) {
    await this.businessService.addBusiness(data);
  }
}
