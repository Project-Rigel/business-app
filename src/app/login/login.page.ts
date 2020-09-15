import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AddBusinessWizardComponent } from './add-business-wizard/add-business-wizard.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userForm;
  userId: string;
  prueba = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService,
    public modalController: ModalController,
  ) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: '',
      password: '',
      fullName: '',
    });
  }

  async registerUser() {
    await this.authService
      .createUser(this.userForm.value.email, this.userForm.value.password)
      .then(async isNewUser => {
        if (isNewUser) {
          await this.startAddBusinessWizard();
        } else {
          await this.router.navigate(['app', 'tabs']);
        }
      });
  }

  async logOut() {
    await this.authService.logOut();
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle().then(async isNewUser => {
      if (isNewUser) {
        await this.startAddBusinessWizard();
      } else {
        await this.router.navigate(['app', 'tabs']);
      }
    });
  }

  async startAddBusinessWizard() {
    const modal = await this.modalController.create({
      component: AddBusinessWizardComponent,
      swipeToClose: false,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (!data.done) {
      await this.logOut();
      // Delete temporal user since he/she the canceled business wizard
      this.authService.deleteCurrentUser();
    } else {
      this.authService.saveBusiness(data.values);
      console.log(data.values);
      await this.router.navigate(['app', 'tabs']);
    }
  }
}
