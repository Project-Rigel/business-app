import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authState: firebase.User;

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(state =>{
      this.authState = state;
    })
  }

  get isAuthenticated(){
    return this.authState;
  }

}
