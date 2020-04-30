import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user$: Observable<firebase.User>;
  userForm;
  constructor(
    private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: '',
      password: '',
      fullName: '',
    });
    this.user$ = this.afAuth.authState;
  }

  async registerUser() {
    try {
      await this.afAuth.createUserWithEmailAndPassword(
        this.userForm.value.email,
        this.userForm.value.password,
      );
    } catch (e) {
      const toast = await this.toastController.create({
        message: e.message,
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      throw e;
    }
  }

  async logOut() {
    try {
      await this.afAuth.signOut();
    } catch (e) {
      const toast = await this.toastController.create({
        message: e.message,
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      throw e;
    }
  }

  async loginWithGoogle() {
    try {
      await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (e) {
      const toast = await this.toastController.create({
        message: e.message,
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      throw e;
    }
  }

}
