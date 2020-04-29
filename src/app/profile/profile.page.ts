import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
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
